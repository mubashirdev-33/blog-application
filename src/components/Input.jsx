import React from 'react'

const Input = ({ type, placeholder, handler ,value,name}) => {
  return (
    <div>
      <input className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"  type={type} placeholder={placeholder} value={value}     onChange={(e) => {
          if (type === "file") {
            handler(name, e.target.files[0]);
          } else {
            handler(name, e.target.value);
          }
        }}/>

    </div>
  )
}

export default Input