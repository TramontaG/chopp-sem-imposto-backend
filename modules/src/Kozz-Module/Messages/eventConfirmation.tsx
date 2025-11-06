import { Bold, Line } from "kozz-module-maker";

const formatName = (name: string) => {
  const firstName = name.split(" ")[0];

  return firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase();
};

export const eventConfirmation1 = ({ name }: { name: string }) => {
  return (
    <>
      <Line>
        Bom dia {formatName(name)}! Mateus aqui pra te convidar pra mais um
        <Bold>Chopp sem imposto! 🍻</Bold>
      </Line>
      <Line>
        Vai rolar dia <Bold>06/11 às 19h</Bold>, lá na Van Been Tap House - Rua
        Joaquim Távora, 1039
      </Line>
      <Line>
        Mesmo esquema de sempre: boa cerveja, boa conversa e preço sem imposto
      </Line>
      <Line />
      <Line>Me dá um ok! e eu já ativo o seu desconto!</Line>
    </>
  );
};

export const eventConfirmation2 = ({ name }: { name: string }) => {
  return (
    <>
      <Line>Fala {formatName(name)}! Aqui é o Mateus</Line>
      <Line>
        Tô passando pra te avisar que vem aí mais um{" "}
        <Bold>Chopp sem imposto 🍺</Bold>
      </Line>
      <Line>
        Dia <Bold>06/11 às 19h</Bold> na Van Been Tap House, Rua Joaquim Távora,
        1039
      </Line>
      <Line>Se curtiu os últimos, esse vai ser melhor ainda!</Line>
      <Line />
      <Line>
        Te espero lá! Responde aqui que eu já ativo o desconto pra vc!
      </Line>
      <Line />
    </>
  );
};

export const eventConfirmation3 = ({ name }: { name: string }) => {
  return (
    <>
      <Line>
        Iae {formatName(name)}! Mateus aqui para te avisar que tá confirmado o
        próximo <Bold>Chopp sem imposto!</Bold>
      </Line>
      <Line>
        Vai ser dia <Bold>06/11 às 19h</Bold> na Van Been Tap House - R. Joaquim
        Távora, 1039
      </Line>
      <Line>
        Aquela vibe de sempre: cerveja top, sem imposto e muita resenha
      </Line>
      <Line />
      <Line>
        Bora de novo? Me dá um “tô dentro” aqui na mensagem que eu já te coloco
        na lista e ativo seu desconto 🍻
      </Line>
      <Line />
    </>
  );
};

export const eventConfirmation4 = ({ name }: { name: string }) => {
  return (
    <>
      <Line>Oii {formatName(name)}, tudo certo? Mateus aqui</Line>
      <Line>
        Já pode marcar na agenda: <Bold>Chopp sem imposto</Bold> dia{" "}
        <Bold>06/11 às 19h</Bold> na Van Been Tap House, Rua Joaquim Távora,
        1039
      </Line>
      <Line>Os últimos foram sucesso, quer garantir o desconto?</Line>
      <Line />
      <Line>É só responder aqui que eu já ativo teu desconto! 🍺</Line>
      <Line />
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
