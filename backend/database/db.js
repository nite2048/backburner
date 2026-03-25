import { prisma } from './prismaClient.js'

export async function getAllUsers() {
    return prisma.user.findMany();
}

export async function findUserById(paylodUserId) {
    return prisma.user.findUnique({ where: { id: paylodUserId } });
}

export async function getPrismaUserByGoogleAuth(googleAuthResponse){
     const user = await prisma.user.findUnique({ where: { googleId : googleAuthResponse.id }});
     if(user == null){
          return prisma.user.create({
              data: {
                  googleId: googleAuthResponse.id,
                  email: googleAuthResponse.email,
                  name: googleAuthResponse.name
              }
          });
     }else{
          return user;
     }

}

export async function getPrismaUserByGithubAuth(githubAuthResponse){
     const user = await prisma.user.findUnique({ where: { githubId : githubAuthResponse.node_id }});
     if(user == null){
          return prisma.user.create({
              data: {
                  githubId: githubAuthResponse.node_id,
                  email: githubAuthResponse.email,
                  name: githubAuthResponse.name
              }
          });
     }else{
          return user;
     }
}

export async function createItem(userId, metadata) {
     const genreNames = metadata.genres //Array of the genres

     const item = await prisma.item.create({
       data: {
         description: metadata.description,
         category: metadata.category,
         startDate: metadata.startDate,
         averageScore: metadata.averageScore,
         coverImage: metadata.coverImage,

         author: {
           connect: {
             id: userId,
           },
         },

         title: {
           create: {
             name: metadata.title.name,
             originalName: metadata.title.originalName,
             transliteratedName: metadata.title.transliteratedName,
           },
         },

          genres: {
               connectOrCreate: genreNames.map((name) => ({
                 where: { name },
                 create: { name },
               })),
          },
       },
     });

     return item;
}

export async function findItem(itemId) {
     const item = await prisma.item.findUnique({
          where: {
               id: itemId,
          },

          include: {
              title: true,
              genres: true
          }
     })

     return item;
}

// TODO test this function, it might not be safe
export async function updateItem(itemId, metadata) {
  const data = {};

  if (metadata.description !== undefined) {
    data.description = metadata.description;
  }

  if (metadata.category !== undefined) {
    data.category = metadata.category;
  }

  if (metadata.startDate !== undefined) {
    data.startDate = metadata.startDate;
  }

  if (metadata.averageScore !== undefined) {
    data.averageScore = metadata.averageScore;
  }

  if (metadata.coverImage !== undefined) {
    data.coverImage = metadata.coverImage;
  }

  if (metadata.title !== undefined) {
    data.title = {
      update: {
        ...(metadata.title.name !== undefined && {
          name: metadata.title.name,
        }),
        ...(metadata.title.originalName !== undefined && {
          originalName: metadata.title.originalName,
        }),
        ...(metadata.title.transliteratedName !== undefined && {
          transliteratedName: metadata.title.transliteratedName,
        }),
      },
    };
  }

  if (metadata.genres !== undefined) {
    data.genres = {
      set: [],
      connectOrCreate: metadata.genres.map((name) => ({
        where: { name },
        create: { name },
      })),
    };
  }

  const item = await prisma.item.update({
    where: { id: itemId },
    data,
  });

  return item;
}

export async function deleteItem(itemId) {
     const item = await prisma.item.delete({
          where: {
               id: itemId,
          }
     })

     return item;
}

export async function findItemsByUserId(userId) {
     const items = await prisma.item.findMany({
          where: {
               authorId: userId,
          },

          include: {
              title: true,
              genres: true
          }
     })

     return items;
}
