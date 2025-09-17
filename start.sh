#!/usr/bin/env bash
# chmod +x dev.sh && ./dev.sh
set -euo pipefail

# =======================
# Configuração
# =======================
# Política de restart:
MAX_RESTARTS=0        # 0 = infinito; ou defina um nº máximo (ex.: 10)
MAX_BACKOFF=30        # segundos (limite superior do backoff exponencial)
ON_ZERO_EXIT_RESTART=1 # 1 = reinicia mesmo se sair com 0; 0 = não reinicia se sair com 0

# Defina seus processos aqui (mesma ordem entre TAGS/DIRS/CMDS):
TAGS=("Baileys" "Gateway" "Module")
DIRS=("./kozz-baileys" "./kozz-gateway" "./modules")
CMDS=("npm run start"  "npm run start"   "npm run start")

# =======================
# Infra do Supervisor
# =======================
declare -a PIDS=()
declare -a ATTEMPTS=()
STOP=0

ts() { date +"%H:%M:%S"; }

log() {
  local level="$1"; shift
  echo "[$(ts)] [Supervisor][$level] $*"
}

cleanup() {
  [[ $STOP -eq 1 ]] && return
  STOP=1
  log INFO "Encerrando todos os processos..."
  for pid in "${PIDS[@]:-}"; do
    if [[ -n "${pid:-}" ]] && kill -0 "$pid" 2>/dev/null; then
      kill -TERM "$pid" 2>/dev/null || true
    fi
  done
  # Aguarda encerrar (evita zumbis)
  wait || true
  log INFO "Finalizado."
}

trap cleanup INT TERM

# =======================
# Função: supervisionar um serviço individualmente
# =======================
start_supervised() {
  local idx="$1"
  local tag="${TAGS[$idx]}"
  local dir="${DIRS[$idx]}"
  local cmd="${CMDS[$idx]}"

  ATTEMPTS[$idx]=0
  local backoff=1

  while [[ $STOP -eq 0 ]]; do
    ATTEMPTS[$idx]=$(( ATTEMPTS[$idx] + 1 ))

    if [[ "${ATTEMPTS[$idx]}" -gt 1 ]]; then
      log INFO "$tag: tentando reiniciar (tentativa ${ATTEMPTS[$idx]})..."
    else
      log INFO "$tag: iniciando..."
    fi

    (
      cd "$dir"
      # stdout+stderr com prefixo
      eval "$cmd" |& sed "s/^/[$tag]: /"
    ) &
    local child=$!
    PIDS[$idx]=$child

    # Aguarda término do processo filho
    wait "$child"
    local status=$?

    # Se estamos parando o supervisor, não reinicia
    [[ $STOP -eq 1 ]] && break

    # Saiu com 0?
    if [[ $status -eq 0 && $ON_ZERO_EXIT_RESTART -eq 0 ]]; then
      log INFO "$tag: saiu com status 0 (sem erro). Não será reiniciado."
      break
    fi

    # Verifica limite de reinícios
    if [[ $MAX_RESTARTS -ne 0 && "${ATTEMPTS[$idx]}" -gt $MAX_RESTARTS ]]; then
      log ERROR "$tag: atingiu o limite de reinícios ($MAX_RESTARTS). Não será reiniciado."
      break
    fi

    # Faz backoff antes de reiniciar
    log WARN "$tag: processo terminou com status $status. Reiniciando em ${backoff}s..."
    sleep "$backoff"
    # Incrementa backoff exponencial com teto
    backoff=$(( backoff * 2 ))
    (( backoff > MAX_BACKOFF )) && backoff=$MAX_BACKOFF
  done
}

# =======================
# Boota todos os serviços em paralelo
# =======================
for i in "${!TAGS[@]}"; do
  start_supervised "$i" &
done

# Aguarda até todos finalizarem (seja por sair limpo ou limite de retries)
wait
exit 0
