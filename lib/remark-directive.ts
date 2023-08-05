import { visit } from "unist-util-visit";
import remarkDirective from "remark-directive";

// ContainerDirective | LeafDirective
const handleYoutubeDirective = (node: any) => {
  const data = node.data || (node.data = {});
  // const metadata = await fetch(
  //   "https://noembed.com/embed?url=https://www.youtube.com/watch?v=" +
  //     node.attributes.id,
  // ).then((res) => res.json());
  // console.log(metadata);
  data.hName = "div";
  data.hProperties = { className: "youtube" };
  data.hChildren = [
    {
      type: "element",
      tagName: "iframe",
      properties: {
        src: "https://www.youtube.com/embed/" + node.attributes.id,
        title: "YouTube video player",
        frameBorder: 0,
        allow:
          "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
        allowFullScreen: true,
      },
    },
    {
      // YouTube Image
      type: "element",
      tagName: "img",
      properties: {
        src:
          "https://img.youtube.com/vi/" +
          node.attributes.id +
          "/maxresdefault.jpg",
        alt: "YouTube video thumbnail",
      },
    },
  ];
};

export const remarkDirectivePlugin: typeof remarkDirective = () => {
  return (tree, file) => {
    visit(tree, (node) => {
      if (
        node.type === "textDirective" ||
        node.type === "leafDirective" ||
        node.type === "containerDirective"
      ) {
        if (node.name === "youtube") {
          if (node.type === "textDirective") {
            file.info("Text directives for `youtube` not supported", node);
            return;
          }
          handleYoutubeDirective(node);
        } else {
          const data = node.data || (node.data = {});
          data.hName = node.name;
          data.hProperties = node.attributes;
        }
      }
    });
  };
};
