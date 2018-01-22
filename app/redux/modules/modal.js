const OPEN_MODAL = 'OPEN_MODAL'
const CLOSE_MODAL = 'CLOSE_MODAL'
const UPDATE_TEXT = 'UPDATE_TEXT'

export function openModal () {
  return {
    type: OPEN_MODAL,
  }
}

export function closeModal () {
  return {
    type: CLOSE_MODAL,
  }
}

export function updateText (newText) {
  return {
    type: UPDATE_TEXT,
    newText,
  }
}

const initialState = {
  text: '',
  isOpen: false,
}

export default function modal (state = initialState, action) {
  switch (action.type) {
    case OPEN_MODAL :
      return {
        ...state,
        isOpen: true,
      }
    case CLOSE_MODAL :
      return {
        text: '',
        isOpen: false,
      }
    case UPDATE_TEXT :
      return {
        ...state,
        text: action.newText,
      }
    default :
      return state
  }
}
