package com.meetup.meetup.dao;

import com.meetup.meetup.entity.Item;
import com.meetup.meetup.entity.ItemPriority;

import java.util.List;

public interface ItemDao extends Dao<Item> {

    List<Item> getWishListByUserId(int userId);

    Item findByUserIdItemId(int userId, int itemId);

    Item addToUserWishList(int userId, int itemId, ItemPriority priority);

    Item deleteFromUserWishList(int userId, int itemId);

    Item addBookerForItem(int ownerId, int itemId, int bookerId);

    Item removeBookerForItem(int ownerId, int itemId);

    Item addLike(int itemId, int userId);

    Item removeLike(int itemId, int userId);

    List<Item>  findBookingByUserLogin (String login, String[] tagArray);

    List<Item> findBookingByUserLogin(String login);

    List<Item> getPopularItems(String[] tagArray);

    List<Item> getPopularItems();

    List<Item> findBookedItemsByUserId(int userId);

    List<Item> findItemsByTagName(String tagName);
}