import React from 'react'
import PropTypes from 'prop-types'
import {partial} from '../../lib/utils'

export const TodoItem = (props) => {
  const handleToggle = partial(props.handleToggle, props.id)
  const handleRemove = partial(props.handleRemove, props.id)

  return (
    <li>
      <span className="delete-item">
        <a href="#" onClick={handleRemove}>X</a>
      </span>
      <input
        type="checkbox"
        onChange={handleToggle}
        checked={props.isComplete}
      /> {props.name}</li>
  )
}

TodoItem.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  isComplete: PropTypes.bool,
  handleToggle: PropTypes.func.isRequired,
  handleRemove: PropTypes.func.isRequired
}
