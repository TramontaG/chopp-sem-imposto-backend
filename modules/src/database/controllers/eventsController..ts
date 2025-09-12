import DbManager from "..";

const eventsDb = DbManager("event");

const eventsController = () => {
  const createEvent = ({
    name,
    description,
  }: {
    name: string;
    description: string;
    location: string;
    date: number;
  }) => {};
};

export default eventsController();
