import { CommentStatus, PostStatus } from "../../../generated/prisma/enums";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";
import {
  ICreatePostPayload,
  IPostQuery,
  IUpdatePostPayLoad,
} from "./post.interface";

const createPost = async (payload: ICreatePostPayload, userId: string) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId: userId,
    },
  });

  return result;
};
const allPost = async (query: IPostQuery) => {
  const { title, content, searchTerm, limit, page, sortBy, sortOrder } = query;
  console.log(title, content);
  const contentLimit = limit ? Number(limit) : 5;
  const pageNo = page ? Number(page) : 1;
  const skip = (pageNo - 1) * contentLimit;

  const sortedBy = sortBy ? sortBy : "createdAt";
  const sortedOrder = sortOrder ? sortOrder : "desc";

  const andCondition: PostWhereInput[] = [];

  if (searchTerm) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: "prISma",
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: "node.js",
            mode: "insensitive",
          },
        },
      ],
    });
  }

  if (title) {
    andCondition.push({ title });
  }

  if (content) {
    andCondition.push({ content });
  }

  if (query.authorId) {
    andCondition.push({
      authorId: query.authorId,
    });
  }

  if (query.isFeatured) {
    andCondition.push({
      isFeatured: Boolean(query.isFeatured),
    });
  }

  if (query.tags) {
    const parsedTags = JSON.parse(query.tags as string);

    andCondition.push({
      tags: {
        hasSome: parsedTags,
      },
    });
  }

  const posts = await prisma.post.findMany({
    // filter posts by title and content
    // where: {
    //   title: "Prisma Transactions Explained",
    //   content: "Node js",
    //   tags :{
    //     has:"typescript node js"
    //     }
    // },

    // this approach is not appropriate for searching
    // where: {
    //   title: {
    //     contains: "prISma",
    //     mode: "insensitive",
    //   },
    //   content: {
    //     contains: "node.js",
    //     mode: "insensitive",
    //   },
    // },

    // this approach is appropriate for searching

    // where: {
    //   OR: [
    //     {
    //       title: {
    //         contains: "prISma",
    //         mode: "insensitive",
    //       },
    //     },
    //     {
    //       content: {
    //         contains: "node.js",
    //         mode: "insensitive",
    //       },
    //     },
    //   ],
    // },

    // combining search(OR) and filter(AND)
    // where: {
    //   AND: [
    //     {
    //       // searching (OR)
    //       OR: [
    //         {
    //           title: {
    //             contains: "tutorial",
    //             mode: "insensitive",
    //           },
    //         },
    //         {
    //           content: {
    //             contains: "event",
    //             mode: "insensitive",
    //           },
    //         },
    //       ],
    //     },
    //     // filtering
    //     {
    //       title: "Prisma",
    //     },
    //     {
    //       content: "Transactions",
    //     },
    //   ],
    // },

    // pagination
    // take: 2,
    // skip: 0,
    // orderBy: {
    //   createdAt: "asc",
    // },

    // where: {
    //   AND: [
    //     searchTerm
    //       ? {
    //           OR: [
    //             {
    //               title: {
    //                 contains: searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //             {
    //               content: {
    //                 contains: searchTerm,
    //                 mode: "insensitive",
    //               },
    //             },
    //           ],
    //         }
    //       : {},

    //     title
    //       ? {
    //           title: title,
    //         }
    //       : {},

    //     content
    //       ? {
    //           content: content,
    //         }
    //       : {},
    //   ],
    // },

    where: {
      AND: andCondition,
    },

    // pagination
    take: contentLimit,
    skip: skip,
    orderBy: {
      // sortBy : sortOrder
      [sortedBy]: sortedOrder,
    },
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: {
        include: {
          author: {
            omit: {
              id: true,
              password: true,
              activeStatus: true,
              role: true,
              email: true,
              updatedAt: true,
            },
          },
        },
      },
    },
  });
  return posts;
};

// const getPostById = async (postId: string) => {
//   await prisma.post.update({
//     where: {
//       id: postId,
//     },
//     data: {
//       views: {
//         increment: 1,
//       },
//     },
//   });

//   // throw new Error("error get");

//   const post = await prisma.post.findUniqueOrThrow({
//     where: {
//       id: postId,
//     },

//     include: {
//       author: {
//         omit: {
//           password: true,
//         },
//       },
//       comments: {
//         where: {
//           status: CommentStatus.APPROVED,
//         },
//         orderBy: {
//           createdAt: "desc",
//         },
//       },
//       _count: {
//         select: {
//           comments: true,
//         },
//       },
//     },
//   });

//   return post;
// };

// Get post by id api using transaction

const getPostById = async (postId: string) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    // 2nd operation
    const post = await tx.post.findUniqueOrThrow({
      where: {
        id: postId,
      },
      include: {
        author: {
          omit: {
            password: true,
          },
        },
        comments: {
          where: {
            status: CommentStatus.APPROVED,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return post;
  });

  return transactionResult;
};

const myPost = async (id: string) => {
  const posts = await prisma.post.findMany({
    where: {
      authorId: id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },

      _count: {
        select: {
          comments: true,
        },
      },
    },
  });

  return posts;
};

const postStatics = async () => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    // const totalPosts = await tx.post.count();

    // const totalPublishedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.PUBLISHED,
    //   },
    // });

    // const totalDraftPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.DRAFT,
    //   },
    // });

    // const totalArchivedPosts = await tx.post.count({
    //   where: {
    //     status: PostStatus.ARCHIVED,
    //   },
    // });

    // const totalComments = await tx.comment.count();

    // const totalApprovedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.APPROVED,
    //   },
    // });

    // const totalRejectedComments = await tx.comment.count({
    //   where: {
    //     status: CommentStatus.REJECT,
    //   },
    // });

    // for getting total views ,this is not a good apprch ,we should use aggregate function
    // const allPosts = await tx.post.findMany();
    // let totalPostViews = 0;
    // allPosts.forEach((post) => {
    //   totalPostViews += post.views;
    // });

    // const totalPostViewsAggregate = await tx.post.aggregate({
    //   _sum: {
    //     views: true,
    //   },
    // });

    // const totalPostViews = totalPostViewsAggregate._sum.views;

    // return {
    //   totalPosts,
    //   totalPublishedPosts,
    //   totalDraftPosts,
    //   totalArchivedPosts,
    //   totalComments,
    //   totalApprovedComments,
    //   totalRejectedComments,
    //   totalPostViews,
    // };

    const [
      totalPosts,
      postStatusGrp,
      totalCommentsGrp,
      totalComments,
      totalPostViewsAggregate,
    ] = await Promise.all([
      tx.post.count(), // total posts

      tx.post.groupBy({
        // group by post status
        by: ["status"],
        _count: {
          status: true,
        },
      }),

      //  tx.post.count({
      //   where: {
      //     status: PostStatus.PUBLISHED,
      //   },
      // }),

      //  tx.post.count({
      //   where: {
      //     status: PostStatus.DRAFT,
      //   },
      // }),

      //  tx.post.count({
      //   where: {
      //     status: PostStatus.ARCHIVED,
      //   },
      // }),

      tx.comment.groupBy({
        // group by comment status
        by: ["status"],
        _count: {
          status: true,
        },
      }),

      tx.comment.count(), // total comments

      //  tx.comment.count({
      //   where: {
      //     status: CommentStatus.APPROVED,
      //   },
      // }),

      //  tx.comment.count({
      //   where: {
      //     status: CommentStatus.REJECT,
      //   },
      // }),
      tx.post.aggregate({
        // sum of views
        _sum: {
          views: true,
        },
      }),
    ]);

    // console.log("group by post status", postStatusGrp);
    const selectPublishedPost = postStatusGrp.filter(
      (post) => post.status === PostStatus.PUBLISHED,
    );
    const selectDraftPost = postStatusGrp.filter(
      (post) => post.status === PostStatus.DRAFT,
    );
    const selectArchivedPost = postStatusGrp.filter(
      (post) => post.status === PostStatus.ARCHIVED,
    );
    const totalPublishedPosts = selectPublishedPost[0]?._count?.status;
    const totalDraftPosts = selectDraftPost[0]?._count?.status;
    const totalArchivedPosts = selectArchivedPost[0]?._count?.status;

    const selectApprovedComment = totalCommentsGrp.filter(
      (comment) => comment.status === CommentStatus.APPROVED,
    );
    const selectRejectedComment = totalCommentsGrp.filter(
      (comment) => comment.status === CommentStatus.REJECT,
    );

    const totalApprovedComments = selectApprovedComment[0]?._count?.status;
    const totalRejectedComments = selectRejectedComment[0]?._count?.status;

    return {
      totalPosts,
      totalPublishedPosts,
      totalDraftPosts,
      totalArchivedPosts,
      totalApprovedComments,
      totalRejectedComments,
      totalComments,
      totalPostViews: totalPostViewsAggregate._sum.views,

      // totalPosts,
      // totalPublishedPosts,
      // totalDraftPosts,
      // totalArchivedPosts,
      // totalComments,
      // totalApprovedComments,
      // totalRejectedComments,
      // totalPostViews: totalPostViewsAggregate._sum.views,
    };
  });

  return transactionResult;
};

const updatePost = async (
  postId: string,
  payLoad: IUpdatePostPayLoad,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the author of this post");
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payLoad,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
      comments: true,
    },
  });
  return result;
};

const DeletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId !== authorId) {
    throw new Error("You are not the author of this post");
  }

  await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};

export const postService = {
  allPost,
  postStatics,
  myPost,
  getPostById,
  createPost,
  updatePost,
  DeletePost,
};
