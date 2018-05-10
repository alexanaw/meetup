export class Item {
  itemId: number;
  name: string;
  description: string;
  ownerId: number;
  bookerId: number;
  priority: string;
  imageFilepath: string;
  link: string;
  dueDate: string;
  likes: number;
  tags: string[] = [];

  clone() : Item {
    let itemClone = new Item();

    itemClone.itemId = this.itemId;
    itemClone.name = this.name;
    itemClone.description = this.description;
    itemClone.ownerId = this.ownerId;
    itemClone.bookerId = this.bookerId;
    itemClone.priority = this.priority;
    itemClone.imageFilepath = this.imageFilepath;
    itemClone.link = this.link;
    itemClone.dueDate = this.dueDate;
    itemClone.likes = this.likes;
    itemClone.tags = this.tags;

    return itemClone;
  }
}

