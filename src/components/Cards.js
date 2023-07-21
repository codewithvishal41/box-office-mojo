import React, { useState,useEffect } from 'react';
import ReactStars from 'react-stars';
import { Bars } from 'react-loader-spinner';
import { getDocs } from 'firebase/firestore';
import { moviesRef } from '../firebase/firebase';
import { Link } from 'react-router-dom';
const Cards = () => {
    const [data,setData]=useState([])
    const[loader,setLoader]=useState(false);
        // {
        //     name: "Cold Soul",
        //     rating:5,
        //     year:"2022",
        //     img: "https://themarketingbirds.com/wp-content/uploads/2021/04/Creative-Movie-Posters-64-2.jpg"
        // }
    
        useEffect(()=>{
         
          async function getData(){
            setLoader(true);

            const _data =await getDocs(moviesRef);
            // console.log(movieData);
            _data.forEach((doc)=>{
                setData((prv)=>[...prv,{...(doc.data()), id:doc.id}])
            })

            setLoader(false);

          }
          getData();
        },[])

    
  return (
    <div className='flex flex-wrap justify-between p-3 mt-2'>
    { loader? <div className='w-full flex justify-center items-center h-96'><Bars height={60} color='white'/></div> :
    data.map((e,i)=>{
        return(

    
       <Link to={`/detail/${e.id}`}><div key={i} className='cards text-sm md:text-base shadow-xl w-40 sm:w-44 md:w-60 h:56 sm:h-72 md:h-80 font-semibold  p-2 hover:-translate-y-4 cursor-pointer mt-6 transition-all duration-500 rounded-lg '>
        <img className='w-full h-48 md:h-64 ' src={e.image} alt="image of movies"/>
         <h1>{e.title}</h1>
         <h1 className='flex items-center'> <span className="text-gray-400 mr-1 pt-1">Rating:</span> 
         <ReactStars
            size={18}
            half={true}
            value={e.rating/e.rated}
            edit={false}
         />
         </h1>
         <h1> <span className="text-gray-400"> Year: </span>{e.year}</h1>
      </div>
      </Link>
      )})
      
      }

      
    </div>
  )
}

export default Cards
