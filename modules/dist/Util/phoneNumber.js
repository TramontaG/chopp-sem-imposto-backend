"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.userPhoneToBrNational = exports.phoneToJid = exports.jidToBrNational = exports.formatPhoneNumber = exports.digits = void 0;
const formatPhoneNumber = value => {
  // Remove all non-digits
  let digits = value.replace(/\D/g, "");
  // Remove initial 55 if it has
  if (digits.startsWith("55")) {
    digits = digits.slice(2);
  }

  // Apply mask (00)00000-0000
  if (digits.length === 0) {
    return "";
  } else if (digits.length <= 2) {
    return `(${digits}`;
  } else if (digits.length <= 7) {
    return `(${digits.slice(0, 2)})${digits.slice(2)}`;
  } else {
    return `(${digits.slice(0, 2)})${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
  }
};
exports.formatPhoneNumber = formatPhoneNumber;
const digits = s => s.replace(/\D/g, "");
exports.digits = digits;
const userPhoneToBrNational = phone => {
  const d = digits(phone);
  // guarda 10 ou 11 últimos dígitos (caso tenha vindo com +55 ou algo extra)
  return d.length > 11 ? d.slice(d.length - 11) : d;
};
exports.userPhoneToBrNational = userPhoneToBrNational;
const jidToBrNational = jid => {
  const beforeAt = jid.split("@")[0];
  let d = digits(beforeAt);
  // remove DDI "55" se presente
  if (d.startsWith("55")) d = d.slice(2);
  // Aceita 10 (fixo) ou 11 (celular) dígitos para BR
  if (d.length === 10 || d.length === 11) return d;
  return null; // fora do padrão esperado
};
exports.jidToBrNational = jidToBrNational;
const phoneToJid = phone => {
  // Remove tudo que não for dígito
  const digits = phone.replace(/\D/g, "");

  // Garante que só fiquem os 10 ou 11 últimos dígitos (DDD + número)
  const national = digits.slice(-11);

  // Retorna no formato de JID
  return `55${national}@s.whatsapp.net`;
};
exports.phoneToJid = phoneToJid;
//# sourceMappingURL=phoneNumber.js.map