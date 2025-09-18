import { Bold, Line } from "kozz-module-maker";

/**
 * Gets only the first name and proper capitalizes it
 * @param name
 * @returns
 */
const formatName = (name: string) => {
  const firstName = name.split(" ")[0];

  return (
    firstName.charAt(0).toUpperCase() + //first letter to upercase
    firstName.slice(1).toLowerCase() // rest of the first name in lower case
  );
};

export const eventConfirmation1 = ({
  name,
  link,
}: {
  name: string;
  link: string;
}) => {
  return (
    <>
      <Line>Oi {formatName(name)}, Mateus aqui!</Line>
      <Line>
        Estou enviando essa mensagem para te fazer um convite! Dia{" "}
        <Bold>25/09</Bold> teremos mais uma edição do Chopp Sem Imposto, na Van
        Been Tap House - Vila Mariana às 19hrs.
      </Line>
      <Line />
      <Line>
        <Bold>Confirme a presença no link e garanta seu desconto</Bold>
      </Line>
      <Line>
        Não bebe? Ainda assim vale participar e levar amigos! Nos vemos lá? 🍻
      </Line>
      <Line />
      <Line>{link}</Line>
    </>
  );
};

export const eventConfirmation2 = ({
  name,
  link,
}: {
  name: string;
  link: string;
}) => {
  return (
    <>
      <Line>Oi {formatName(name)}, aqui é o Mateus</Line>
      <Line>
        Quero te convidar para mais um evento! No dia <Bold>25/09</Bold>, às
        19h, vai rolar mais uma edição do Chopp Sem Imposto na Van Been Tap
        House - Vila Mariana.
      </Line>
      <Line />
      <Line>
        <Bold>Já garantiu sua inscrição? É só clickar no link!</Bold>
      </Line>
      <Line>
        Mesmo quem não bebe pode participar e chamar amigos. Vai ser demais,
        espero você lá! 🍻
      </Line>
      <Line />
      <Line>{link}</Line>
    </>
  );
};

export const eventConfirmation3 = ({
  name,
  link,
}: {
  name: string;
  link: string;
}) => {
  return (
    <>
      <Line>
        Olá {formatName(name)}, Mateus passando pra te lembrar de mais um
        evento!
      </Line>
      <Line>
        Na quinta, <Bold>25/09</Bold>, às 19h, teremos o Chopp Sem Imposto na
        Van Been Tap House - Vila Mariana.
      </Line>
      <Line />
      <Line>
        <Bold>
          Confirme sua participação no site para garantir seu desconto
        </Bold>
      </Line>
      <Line>
        Mesmo sem beber, vale ir, curtir o ambiente, chamar amigos e trocar
        ideias. Bora?
      </Line>
      <Line />
      <Line>Confirme sua participação no link: {link}</Line>
    </>
  );
};

export const inviteFriendMessage1 = () => {
  return (
    <>
      <Line>
        Ahh e se quiser chamar alguém, é só mandar esse link pra ela também
        aproveitar o desconto!
      </Line>
      <Line />
      <Line>https://iluminandoaescuridao.com.br</Line>
    </>
  );
};

export const inviteFriendMessage2 = () => {
  return (
    <>
      <Line>
        Ah, e se lembrar de alguém que possa curtir também, compartilha o link
        com essa pessoa pra ela garantir o desconto!
      </Line>
      <Line />
      <Line>https://iluminandoaescuridao.com.br</Line>
    </>
  );
};

export const inviteFriendMessage3 = () => {
  return (
    <>
      <Line>
        Ah, e se quiser convidar alguém pra vir junto, pode passar esse link, é
        só cadastrar para garantir o desconto!
      </Line>
      <Line />
      <Line>https://iluminandoaescuridao.com.br</Line>
    </>
  );
};
