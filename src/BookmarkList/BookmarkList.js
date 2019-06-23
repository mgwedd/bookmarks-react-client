import React, { Component } from 'react';
import BookmarkItem from '../BookmarkItem/BookmarkItem';
import './BookmarkList.css'

class BookmarkList extends Component {
  static defaultProps = {
    bookmarks : [], 
    onClickEdit : () => {}, 
    onClickDelete : () => {}
  };

  render() {
    const { bookmarks, onClickDelete, onClickEdit } = this.props
    return (
      <section className='BookmarkList'>
        <h2>Your bookmarks</h2>
        <ul className='BookmarkList__list' aria-live='polite'>
          {bookmarks.map(bookmark =>
            <BookmarkItem
              key={bookmark.id}
              onClickDelete={onClickDelete}
              onClickEdit={onClickEdit}
              {...bookmark}
            />
          )}
        </ul>
      </section>
    );
  }
}

export default BookmarkList;
