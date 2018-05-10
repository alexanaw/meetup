package com.meetup.meetup.dao.rowMappers;

import com.meetup.meetup.entity.Item;
import com.meetup.meetup.entity.ItemPriority;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

import static com.meetup.meetup.keys.Key.*;

public class ExtendedItemRowMapper implements RowMapper<Item> {
    @Override
    public Item mapRow(ResultSet resultSet, int i) throws SQLException {
        Item item = new Item();
        Timestamp date;
        String itemPriority;

        item.setItemId(resultSet.getInt(ITEM_ITEM_ID));
        item.setName(resultSet.getString(ITEM_NAME));
        item.setDescription(resultSet.getString(ITEM_DESCRIPTION));
        item.setImageFilepath(resultSet.getString(ITEM_IMAGE_FILEPATH));
        item.setLink(resultSet.getString(ITEM_LINK));
        date = resultSet.getTimestamp(ITEM_DUE_DATE);
        item.setDueDate(date == null ? null : date.toString());
//        item.setLikes(resultSet.getInt(ITEM_LIKES));
        item.setOwnerId(resultSet.getInt(USER_ITEM_USER_ID));
        item.setBookerId(resultSet.getInt(USER_ITEM_BOOKER_ID));
        itemPriority = resultSet.getString(PRIORITY_NAME);
        item.setPriority(itemPriority != null ?ItemPriority.valueOf(itemPriority) : null);

        return item;
    }
}
