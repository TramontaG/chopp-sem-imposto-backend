import { Line, Render } from "kozz-module-maker";

export const InviteMessage = ({ groupName }: { groupName?: string }) => {
  return (
    <>
      <Render when={!groupName}>
        <Line>Oi, tudo bom? Meu nome é Mateus!</Line>
      </Render>
      <Render when={!!groupName}>
        <Line>
          Oi, tudo bom? Meu nome é Mateus e eu também faço parte do grupo{" "}
          {groupName}
        </Line>
      </Render>
      <Line />
      <Line>
        Não sei se você ta sabendo, mas vai rolar o chopp sem imposto na quinta
        feira, dia 25/09, e seria muito legal se você participasse com a gente
      </Line>
      <Line />
      <Line>
        Você tem interesse? Se sim, me avisa que eu te mando o link para se
        inscrever!
      </Line>
    </>
  );
};
