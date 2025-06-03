import React from 'react'

type ErrorComponentProp = {
    message:string
}

const ErrorComponent:React.FC<ErrorComponentProp> = ({message}) => {
  return (
    <div>
        <div>
            <span>Error occured</span>
            <span>
                <i className='fa-solid fa-cross'></i>
            </span>
        </div>

        <div>
           <p>{message}</p>
        </div>
    </div>
  )
}

export default ErrorComponent