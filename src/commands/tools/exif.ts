import { commands } from "../../globals";
import { editOrReply } from "../../tools";

commands.on(
  {
    name: "exif",
    description: "Get exif information from an image",
  },
  (args) => ({}),
  async (message, args) => {
    return await editOrReply(
      message,
      "unimplemented !!"
    );
  }
);
