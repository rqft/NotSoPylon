import { commands } from "../../globals";
import { editOrReply } from "../../tools";

commands.on(
  {
    name: "exif",
    description: "Get exif information from an image",
  },
  (args) => ({
    image: args.stringOptional()
  }),
  async (message, args) => {
    const image = await Parameters.image(message, args.image)
    const response = await imageExif(message, image.url)
    return await editOrReply(
      message,
      "unimplemented !!"
    );
  }
);
