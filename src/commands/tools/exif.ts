import { commands } from "../../globals";
import { editOrReply } from "../../tools";
import { Parameters } from "../../parameters";
commands.on(
  {
    name: "exif",
    description: "Get exif information from an image",
  },
  (args) => ({
    image: args.stringOptional(),
  }),
  async (message, args) => {
    const image = await Parameters.imageUrl(args.image, message);
    // const response = await imageExif(message, image);
    return await editOrReply(message, "unimplemented !!");
  }
);
