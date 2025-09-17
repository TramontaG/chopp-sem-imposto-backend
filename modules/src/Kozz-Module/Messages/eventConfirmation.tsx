import { Line } from "kozz-module-maker";

const websiteUrl = "https://iluminandoaescuridao.com.br/event_confirm";

const createConfirmationLink = (userId: string, eventId: string) => {
  return `${websiteUrl}?userId=${userId}&eventId=${eventId}`;
};

export const eventConfirmation1 = ({
  name,
  userId,
  eventId,
}: {
  name: string;
  userId: string;
  eventId: string;
}) => {
  return (
    <>
      <Line>Oi, {name}, Mateus aqui!</Line>
      <Line>
        Estou enviando essa mensagem para te fazer um convite! Dia 25/09 teremos
        mais uma edição do Chopp Sem Imposto, na Van Been Tap House - Vila
        Mariana às 19hrs.
      </Line>
      <Line>
        Não bebe? Ainda assim vale participar e levar amigos! Nos vemos lá? 🍻
      </Line>
      <Line />
      <Line>
        Confirme a presença e garanta seu desconto no site:{" "}
        {createConfirmationLink(userId, eventId)}
      </Line>
    </>
  );
};

export const eventConfirmation2 = ({
  name,
  userId,
  eventId,
}: {
  name: string;
  userId: string;
  eventId: string;
}) => {
  return (
    <>
      <Line>Oi {name}, aqui é o Mateus!</Line>
      <Line>
        Quero te convidar para mais um evento! No dia 25/09, às 19h, vai rolar
        mais uma edição do Chopp Sem Imposto na Van Been Tap House - Vila
        Mariana.
      </Line>
      <Line>
        Mesmo quem não bebe pode participar e chamar amigos. Vai ser demais,
        espero você lá! 🍻
      </Line>
      <Line>
        Já garantiu sua inscrição? É só acessar:{" "}
        {createConfirmationLink(userId, eventId)}
      </Line>
    </>
  );
};

export const eventConfirmation3 = ({
  name,
  userId,
  eventId,
}: {
  name: string;
  userId: string;
  eventId: string;
}) => {
  return (
    <>
      <Line>Olá {name}, Mateus passando pra te lembrar de mais um evento!</Line>
      <Line>
        Na quinta, 25/09, às 19h, teremos o Chopp Sem Imposto na Van Been Tap
        House - Vila Mariana.
      </Line>
      <Line>
        Mesmo sem beber, vale ir, curtir o ambiente, chamar amigos e trocar
        ideias. Bora?
      </Line>
      <Line>
        Confirme sua participação no site para garantir seu desconto:{" "}
        {createConfirmationLink(userId, eventId)}
      </Line>
    </>
  );
};
