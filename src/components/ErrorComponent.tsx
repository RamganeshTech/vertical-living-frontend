// import React, { useState } from 'react'

// type ErrorComponentProp = {
//   message: string,
//   onClick: () => void
// }

// const ErrorComponent: React.FC<ErrorComponentProp> = ({ message, onClick }) => {

//    const [visible, setVisible] = useState(true);
//   const [animState, setAnimState] = useState<"in" | "out">("in");

//   const handleOkClick = () => {
//     setAnimState("out");
//   };

//   const handleAnimationEnd = () => {
//     if (animState === "out") {
//       setVisible(false);
//         onClick();  
//     }
//   };


//   if (!visible) return null;

//   return (
//     <>
//       <style>{`
//         @keyframes bounceScaleIn {
//           0% { transform: scale(0); }
//           60% { transform: scale(1.1); }
//           80% { transform: scale(0.95); }
//           100% { transform: scale(1); }
//         }
//         @keyframes bounceScaleOut {
//           0% { transform: scale(1); }
//           20% { transform: scale(1.1); }
//           100% { transform: scale(0); }
//         }
//       `}</style>

//     <div onClick={(e)=> {e.stopPropagation(); onClick()}} 
            

//     className='fixed inset-0 bg-[#0a0a0a10] z-[1099] flex items-center justify-center px-4'>
//       <div     
//        style={{
//           animation:
//             animState === "in"
//               ? "bounceScaleIn 0.6s ease-out forwards"
//               : "bounceScaleOut 0.5s ease-in forwards",
//         }}
//         onAnimationEnd={handleAnimationEnd}
//          className=" bg-[#2f303a] text-gray-800 rounded-2xl !w-[30%] shadow-lg !px-6 max-w-lg sm:!px-3 sm:py-2 sm:w-full text-center !space-y-4">
//         <div className='flex justify-between items-center border-b-1 border-red-500'>
//           <span className='text-white text-lg'>Error occured</span>
//           <span className='cursor-pointer ' onClick={handleOkClick}>
//             <i className='fa-solid fa-xmark text-red-500 text-lg'></i>
//           </span>
//         </div>

//         <div>
//           <p className='text-white text-lg ' >{message[0].toUpperCase() + message.slice(1)}</p>
//           <div className='flex justify-end'>
//           <button  onClick={handleOkClick}  className='cursor-pointer inline-block bg-red-500 px-5 py-1 rounded-md text-white'>
//             ok
//           </button>
//           </div>
//         </div>
//       </div>
//     </div>
//     </>
//   )
// }

// export default ErrorComponent



import React, { useState } from 'react';

type ErrorComponentProp = {
  message: string,
  onClick: () => void
};

const ErrorComponent: React.FC<ErrorComponentProp> = ({ message, onClick }) => {
  const [visible, setVisible] = useState(true);
  const [animState, setAnimState] = useState<"in" | "out">("in");

  const handleOkClick = () => {
     setAnimState('out')
  };

  // Called when bounce out animation finishes
  const handleAnimationEnd = () => {
    if (animState === "out") {
      setVisible(false);  // hide component
      onClick();          // call parent's onClick prop after animation completes
    }
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes bounceScaleIn {
          0% { transform: scale(0); }
          60% { transform: scale(1.1); }
          80% { transform: scale(0.95); }
          100% { transform: scale(1); }
        }
        @keyframes bounceScaleOut {
          0% { transform: scale(1); }
          20% { transform: scale(1.1); }
          100% { transform: scale(0); }
        }
      `}</style>

      <div 
        className='fixed inset-0 bg-[#0a0a0a10] z-[1099] flex items-center justify-center px-4'
        // Prevent clicking background from calling onClick directly
        onClick={() => handleOkClick()}
      >
        <div  
         onClick={e => e.stopPropagation()}    
          style={{
            animation:
              animState === "in"
                ? "bounceScaleIn 0.2s ease-out forwards"
                : "bounceScaleOut 0.2s ease-in forwards",
          }}
          onAnimationEnd={handleAnimationEnd}
          className="bg-[#2f303a] text-gray-800 rounded-2xl !w-[30%] shadow-lg !px-6 max-w-lg sm:!px-3 sm:py-2 sm:w-full text-center !space-y-4"
        >
          <div className='flex justify-between items-center border-b border-red-500 pb-2'>
            <span className='text-white text-lg'>Error occured</span>
            <span className='cursor-pointer' onClick={handleOkClick}>
              <i className='fa-solid fa-xmark text-red-500 text-lg'></i>
            </span>
          </div>

          <div>
            <p className='text-white text-lg'>{message[0].toUpperCase() + message.slice(1)}</p>
            <div className='flex justify-end'>
              <button 
                onClick={handleOkClick} 
                className='cursor-pointer inline-block bg-red-500 hover:bg-red-800 duration-200 px-5 py-1 rounded-md text-white'
              >
                OK
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorComponent;
