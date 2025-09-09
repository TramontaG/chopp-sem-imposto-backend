#!/bin/bash
set -e

# Baileys
(
  cd ./kozz-baileys
  npm run dev 2>&1 | sed 's/^/[Baileys]: /'
) &

# Gateway
(
  cd ./kozz-gateway
  npm run dev 2>&1 | sed 's/^/[Gateway]: /'
) &

# Modules
(
  cd ./modules
  npm run dev 2>&1 | sed 's/^/[Module]: /'
) &

wait
