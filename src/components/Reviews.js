import React, { useContext, useEffect, useState } from 'react';
import ReactStars from 'react-stars';
import { reviewsRef,db } from '../firebase/firebase';
import { addDoc,doc,updateDoc,query,where,getDocs } from 'firebase/firestore';
import { Bars, ThreeDots}  from 'react-loader-spinner';
import swal from 'sweetalert';
import { Appstate } from '../App';
import { useNavigate } from 'react-router-dom';

const Reviews = ({id,prevRating,userRated}) => {
    const[rating,setRating]=useState(0);
    const [loader,setLoader]=useState(false);
    const[form,setForm]=useState("");
    const[data,setData]=useState([]);
    const[reviewLoader,setReviewLoader]=useState(false);
    const [newAdded, setNewAdded] = useState(0);

    const useAppState= useContext(Appstate);
    const navigate=useNavigate();

    const sendReview=async()=>{
        setLoader(true)
        try{
          if(useAppState.login){
            await addDoc(reviewsRef,{
                movieId: id,
                // name:"Vishal Uttam",
                name:useAppState.userName,
                rating:rating,
                thoughts:form,
                timestamp: new Date().getTime() 
            });

            const ref=doc(db,"movies",id);
            await updateDoc(ref,{
                rating: prevRating + rating,
                rated: userRated +1
            })
            setRating(0);
            setForm("");
            setNewAdded(newAdded + 1);
            swal({
                title:"Review Successfully Added",
                icon:"success",
                buttons:false,
                timer:3000
                
              })
            } else{
              navigate('/login');
            }
        }catch(err){
            swal({
              title:err.message,
              icon:"error",
              buttons:false,
              timer:3000
              
            })
          }
          setLoader(false);
    }
        useEffect(()=>{
            async function getData(){
            setReviewLoader(true);
            setData([]);
            let quer= query(reviewsRef, where('movieId','==',id))
            const getQuer = await getDocs(quer);
            getQuer.forEach((doc)=>{
                setData((prev)=> [...prev,doc.data()]);
         })
          setReviewLoader(false);
        }
                getData();
           
        },[newAdded])
  return (
    <div className="mt-4 w-full border-t-2 border-gray-500">
     <ReactStars
            size={25}
            half={true}
            value={rating}
            onChange={(rate)=>setRating(rate)}
         />
      <input
       value={form}
       onChange={(e)=>setForm(e.target.value)}
       placeholder='share your thoughts..'
       className='header h-12 outline-none w-full p-4 '
         />
      <button onClick={sendReview} className='w-full p-2 bg-green-600 mt-4 font-bold flex justify-center'>
      {loader? <Bars height={25} color='white'/> :'Share'}
      </button>

      {
        reviewLoader? 
        <div className="mt-3 flex justify-center"><ThreeDots height={20} color='white'/></div>
        :
        <div className='mt-4'>
        <div><h2 className='mt-4 font-bold mb-4'>Reviews</h2></div>
            {data.map((e, i)=>{
              
                    return(
                        
                        <div className='bg-gray-900 header p-2 w-full mt-2 border-b-2 border-gray-400' key={i}>
                        <div className='flex'>
                            <p className='font-bold  text-blue-500'>{e.name}</p>
                            <p className='ml-2 text-sm flex items-center'>{new Date(e.timestamp).toLocaleString()}</p>
                            </div>
                            <ReactStars
                            size={15}
                            half={true}
                            edit={false}
                            value={e.rating}
                            />
                            <p>{e.thoughts}</p>
                        </div>
                        
                        
                      
                    )
                })}
        </div>
      }
    </div>
  )
}

export default Reviews
