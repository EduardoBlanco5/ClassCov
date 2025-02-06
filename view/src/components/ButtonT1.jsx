import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@heroui/react";


function ButtonT1({path, text='button', hoverBg='blue-900', Color='blue-900', hoverText='white'}) {
    return (
        <Link to={path}> 
                <Button variant='bordered'   
                className={"  px-8  font-semibold hover:duration-500 text-xl    " 
                    + `border-${Color} text-${Color} hover:bg-${hoverBg} hover:text-${hoverText}`
            }
                
                >{text}</Button>
        </Link>
    )
}

export default ButtonT1