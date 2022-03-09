import './MainContent.css'

function MainContent(props:any) {
  return (
    <div className='MainContent'>
      {props.children}
    </div>
  )
}

export default MainContent
