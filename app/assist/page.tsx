'use client'
import * as React from 'react';
import Head from 'next/head';
import {Map, Marker} from '@vis.gl/react-maplibre';
import 'maplibre-gl/dist/maplibre-gl.css';

import { MdOutlineMessage } from "react-icons/md";
import { MdAddCall } from "react-icons/md";


export default function Assist() {
  return (
    <section className='w-full mt-8 flex gap-4 items-center'>
      <Map
        initialViewState={{
          latitude: 36.9,
          longitude: 7.76,
          zoom: 14
        }}
        style={{width: 600, height: 480}}
        mapStyle="https://api.maptiler.com/maps/f0924eda-983d-4a8a-beb5-379d645f17ac/style.json?key=LGnmlQYoNtKqhtbjpL2X"
      >
        <Marker latitude={36.90} longitude={7.74} color="red" />
      </Map>

      <section className='w-1/2 flex flex-col gap-4'>
        <div className='flex gap-4 items-center'>
        <h1 className='text-3xl text-accent font-semibold text-left'>Assist Nearby:</h1>
          <div className='flex items-center gap-3'>
            <label htmlFor="">
              <input type="checkbox" className='mr-2 w-3 h-3' />
              Road Assist
            </label>

            <label> 
              <input type="checkbox" className='mr-2 w-3 h-3' />
              Mechanic
            </label>
          </div>
        </div>

        {/* Cards */}
        <div className='shadow-sm shadow-accent flex flex-col gap-3 px-4 py-3 rounded-md font-semibold'>
          <div className='flex  justify-between  items-center '>
            <span className="text-accent">Name: <span className='text-white'>Tayebi Ahcene</span></span>
            <span className="text-accent">Phone: <span className='text-white'>0659170552</span></span>
          </div>

          <div className='flex justify-between items-center'>
          <span className="text-accent">Type: <span className='text-white'>Road Assist</span></span>

            <div className='flex gap-2'>
              <button className='button'><MdOutlineMessage className='text-xl text-black'/></button>
              <button className='button'> <MdAddCall className='text-xl text-black'/> </button>
            </div>
          </div>
        </div>

        <div className='shadow-sm shadow-accent flex flex-col gap-3 px-4 py-3 rounded-md font-semibold'>
          <div className='flex  justify-between  items-center '>
            <span className="text-accent">Name: <span className='text-white'>Tayebi Ahcene</span></span>
            <span className="text-accent">Phone: <span className='text-white'>0659170552</span></span>
          </div>

          <div className='flex justify-between items-center'>
          <span className="text-accent">Type: <span className='text-white'>Road Assist</span></span>

            <div className='flex gap-2'>
              <button className='button'><MdOutlineMessage className='text-xl text-black'/></button>
              <button className='button'> <MdAddCall className='text-xl text-black'/> </button>
            </div>
          </div>
        </div>

        <div className='shadow-sm shadow-accent flex flex-col gap-3 px-4 py-3 rounded-md font-semibold'>
          <div className='flex  justify-between  items-center '>
            <span className="text-accent">Name: <span className='text-white'>Tayebi Ahcene</span></span>
            <span className="text-accent">Phone: <span className='text-white'>0659170552</span></span>
          </div>

          <div className='flex justify-between items-center'>
          <span className="text-accent">Type: <span className='text-white'>Road Assist</span></span>

            <div className='flex gap-2'>
              <button className='button'><MdOutlineMessage className='text-xl text-black'/></button>
              <button className='button'> <MdAddCall className='text-xl text-black'/> </button>
            </div>
          </div>
        </div>

        <div className='shadow-sm shadow-accent flex flex-col gap-3 px-4 py-3 rounded-md font-semibold'>
          <div className='flex  justify-between  items-center '>
            <span className="text-accent">Name: <span className='text-white'>Tayebi Ahcene</span></span>
            <span className="text-accent">Phone: <span className='text-white'>0659170552</span></span>
          </div>

          <div className='flex justify-between items-center'>
          <span className="text-accent">Type: <span className='text-white'>Road Assist</span></span>

            <div className='flex gap-2'>
              <button className='button'><MdOutlineMessage className='text-xl text-black'/></button>
              <button className='button'> <MdAddCall className='text-xl text-black'/> </button>
            </div>
          </div>
        </div>


      </section>
    </section>
  );
}