import React, { Component } from  'react';
import config from '../config'
// import './EditBookmark.css';

class EditBookmark extends Component {
  static defaultProps = {
    updatedEditedBookmark : () => {}, 
    onClickCancel : () => {},
    currentBookmarkFields : {
      title : 'default title', 
      url : 'www.default.com', 
      description : 'default description', 
      rating : 1
    }
  };

  state = {
    error: null, 
    id : this.props.currentBookmarkFields.id,
    title: this.props.currentBookmarkFields.title, 
    url: this.props.currentBookmarkFields.url, 
    description: this.props.currentBookmarkFields.description, 
    rating: this.props.currentBookmarkFields.rating, 
  };

  updateTitle = event => ( this.setState( {title: event.target.value} ) )
  updateUrl = event => ( this.setState( {url: event.target.value} ) )
  updateDescription = event => ( this.setState( {description: event.target.value} ) )
  updateRating = event => ( this.setState( {rating: event.target.value} ) )

  handleFormSubmit = event => {
    event.preventDefault()
    const { updatedEditedBookmark } = this.props
    // get the updated form fields from the submission
    const { title, url, description, rating } = this.state
    const updatedBookmarkFields = {
      title : title,
      url : url,
      description : description,
      rating : rating,
    }
    console.log('Original bookmark fields vs newly updated ones, right before PATCH fetch operations: ', '...old bookmark: ', this.props.currentBookmarkFields, ' ... and new bookmark : ', updatedBookmarkFields)
    this.setState({ error: null })
    const dynamicPatchEndpoint = config.API_ENDPOINT + `${this.state.id}`
    fetch(dynamicPatchEndpoint, {
      method: 'PATCH',
      body: JSON.stringify(updatedBookmarkFields),
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${config.API_KEY}`
      }
    })
    .then(res => {
      if (!res.ok) {
        // get the error message from the response,
        return res.json().then(error => {
          // then throw it
          throw error
        })
      }
      return res.json()
    })
    .then(editedBookmark => {
      title.value = ''
      url.value = ''
      description.value = ''
      rating.value = ''
      updatedEditedBookmark(editedBookmark)
    })
    .catch(error => {
      this.setState({ error })
    })
  }

  render() {
    const { error, title, url, description, rating } = this.state
    const { onClickCancel } = this.props

    // testing
    const currentFields = Array.from([error, title, url, description, rating])
    console.log('CURRENT BOOKMARK FIELDS: ', currentFields)
    //testing 

    return (
      <section className='AddBookmark'>
      <h2>Edit bookmark</h2>
      <form
        className='AddBookmark__form'
        onSubmit={this.handleFormSubmit}
      >
        <div className='AddBookmark__error' role='alert'>
          {error && <p>{error.message}</p>}
        </div>
        <div>
          <label htmlFor='title'>
            Title
            {' '}
          </label>
          <input
            type='text'
            name='title'
            id='title'
            defaultValue={title}
            onChange={this.updateTitle}
          />
        </div>
        <div>
          <label htmlFor='url'>
            URL
            {' '}
          </label>
          <input
            type='text'
            name='url'
            id='url'
            defaultValue={url}
            onChange={this.updateUrl}
          />
        </div>
        <div>
          <label htmlFor='description'>
            Description
          </label>
          <textarea
            name='description'
            id='description'
            defaultValue={description}
            onChange={this.updateDescription}
          />
        </div>
        <div>
          <label htmlFor='rating'>
            Rating
            {' '}
          </label>
          <input
            type='number'
            name='rating'
            id='rating'
            min='1'
            max='5'
            defaultValue={rating}
            onChange={this.updateRating}
          />
        </div>
        <div className='AddBookmark__buttons'>
          <button type='button' onClick={onClickCancel}>
            Cancel
          </button>
          {' '}
          <button type='submit'>
            Update Bookmark
          </button>
        </div>
      </form>
      </section>
    );
  }
}

export default EditBookmark;

 