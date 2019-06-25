import React, { Component } from 'react';
import BookmarkList from './BookmarkList/BookmarkList';
import AddBookmark from './AddBookmark/AddBookmark';
import EditBookmark from './EditBookmark/EditBookmark'
import Nav from './Nav/Nav';
import config from './config';
import './App.css';

const bookmarks = [
  // {
  //   id: 0,
  //   title: 'Google',
  //   url: 'http://www.google.com',
  //   rating: '3',
  //   desc: 'Internet-related services and products.'
  // },
  // {
  //   id: 1,
  //   title: 'Thinkful',
  //   url: 'http://www.thinkful.com',
  //   rating: '5',
  //   desc: '1-on-1 learning to accelerate your way to a new high-growth tech career!'
  // },
  // {
  //   id: 2,
  //   title: 'Github',
  //   url: 'http://www.github.com',
  //   rating: '4',
  //   desc: 'brings together the world\'s largest community of developers.'
  // }
];

class App extends Component {
  state = {
    page: 'list',
    bookmarks,
    currentBookmarkFields : {},
    error: null,
  };

  changePage = (page) => {
    this.setState({ page })
  }

  setBookmarks = bookmarks => {
    this.setState({
      bookmarks,
      error: null,
      page: 'list',
    })
  }

  addBookmark = bookmark => {
    this.setState({
      bookmarks: [ ...this.state.bookmarks, bookmark ],
    })
  }

  updateEditedBookmark = editedBookmark => {
    // this handler must merge the new fields into the older, now edited bookmark
    const extractedBookmark = editedBookmark[0]
    console.log('EXTRACTED ', extractedBookmark)
    const newBookmarks = this.state.bookmarks.map( bookmark => {
        if (bookmark.id === extractedBookmark.id) {
          return extractedBookmark
        }
        return bookmark
    });
    console.log('new bookmarks about to be passed to state', newBookmarks)
    this.setState({
      bookmarks: newBookmarks,
    })
  }

  onClickEdit = clickedId => {
    const currentBookmarkFields = this.state.bookmarks.find(bookmark => bookmark.id === clickedId)
    this.setState({
      page : 'edit', 
      currentBookmarkFields 
    })
    console.log(`This id was clicked for edit: ${clickedId}. The bookmark we found for it is: `, currentBookmarkFields)
  }

  apiInterface = (urlPath = config.API_ENDPOINT, httpMethod = 'GET') => {
    fetch(urlPath, {
      method: httpMethod,
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(res.status)
        }
        return res.json()
      })
      .then(this.setBookmarks)
      .catch(error => this.setState({ error }))
  }

  componentDidMount() {
    this.apiInterface(config.API_ENDPOINT, 'GET')
  }

  render() {
    const { page, bookmarks, currentBookmarkFields } = this.state
    console.log('in app render, about to call EditBookmark with currentBookmarkFields: ', currentBookmarkFields)
    return (
      <main className='App'>
        <h1>Bookmarks!</h1>
        <Nav clickPage={this.changePage} />
        <div className='content' aria-live='polite'>
          {page === 'add' && (
            <AddBookmark
              onAddBookmark={this.addBookmark}
              onClickCancel={() => this.changePage('list')}
            />
          )}
          {page === 'edit' && (
            <EditBookmark
              updateEditedBookmark={this.updateEditedBookmark}
              currentBookmarkFields={currentBookmarkFields}
              onClickCancel={() => this.changePage('list')}
            />
          )}
          {page === 'list' && (
            <BookmarkList
              onClickEdit={this.onClickEdit}
              bookmarks={bookmarks}
            />
          )}
        </div>
      </main>
    );
  }
}

export default App;