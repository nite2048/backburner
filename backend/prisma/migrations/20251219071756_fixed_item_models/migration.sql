/*
  Warnings:

  - You are about to drop the column `genres` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `translatedName` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `transliteratedName` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Item` table. All the data in the column will be lost.
  - Added the required column `authorId` to the `Item` table without a default value. This is not possible if the table is not empty.

*/
BEGIN TRY

BEGIN TRAN;

-- DropForeignKey
ALTER TABLE [dbo].[Item] DROP CONSTRAINT [Item_userId_fkey];

-- AlterTable
ALTER TABLE [dbo].[Item] DROP COLUMN [genres],
[name],
[originalName],
[translatedName],
[transliteratedName],
[userId];
ALTER TABLE [dbo].[Item] ADD [authorId] NVARCHAR(1000) NOT NULL;

-- CreateTable
CREATE TABLE [dbo].[Title] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    [originalName] NVARCHAR(1000),
    [transliteratedName] NVARCHAR(1000),
    [itemId] INT NOT NULL,
    CONSTRAINT [Title_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Title_itemId_key] UNIQUE NONCLUSTERED ([itemId])
);

-- CreateTable
CREATE TABLE [dbo].[Genre] (
    [id] INT NOT NULL IDENTITY(1,1),
    [name] NVARCHAR(1000) NOT NULL,
    CONSTRAINT [Genre_pkey] PRIMARY KEY CLUSTERED ([id]),
    CONSTRAINT [Genre_name_key] UNIQUE NONCLUSTERED ([name])
);

-- CreateTable
CREATE TABLE [dbo].[_GenreToItem] (
    [A] INT NOT NULL,
    [B] INT NOT NULL,
    CONSTRAINT [_GenreToItem_AB_unique] UNIQUE NONCLUSTERED ([A],[B])
);

-- CreateIndex
CREATE NONCLUSTERED INDEX [_GenreToItem_B_index] ON [dbo].[_GenreToItem]([B]);

-- AddForeignKey
ALTER TABLE [dbo].[Item] ADD CONSTRAINT [Item_authorId_fkey] FOREIGN KEY ([authorId]) REFERENCES [dbo].[User]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[Title] ADD CONSTRAINT [Title_itemId_fkey] FOREIGN KEY ([itemId]) REFERENCES [dbo].[Item]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_GenreToItem] ADD CONSTRAINT [_GenreToItem_A_fkey] FOREIGN KEY ([A]) REFERENCES [dbo].[Genre]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[_GenreToItem] ADD CONSTRAINT [_GenreToItem_B_fkey] FOREIGN KEY ([B]) REFERENCES [dbo].[Item]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
