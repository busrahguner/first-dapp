'use client'

import {useState} from"react";
import { useAccount, useConnect, useDisconnect,useReadContract} from 'wagmi'
import GreetingAbi from"../abis/Greeting.json";
import { useBalance } from 'wagmi';
import {readContract} from '@wagmi/core';
import {writeContract} from '@wagmi/core';
import {config} from "../wagmi";
import { getChainId } from '@wagmi/core';

const greetingAddress = "0x8367579781BD0766BAE7EA70981834f7f83a7880";

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()

  const chainId = getChainId(config)
  console.log("chain id",chainId);

  const result1 = useBalance({
    address: '0xddfCFe20497C0D488cdC1A1e98e55cfF24d54C19',
  })
  console.log("result balance",result1);


  const [greeting,setGreeting] = useState<string>("");
  const [newGreeting,setNewGreeting] = useState("");

  const getGreeting : any = async()=>{
    try{
      const result2 = await readContract(config,{
      abi: GreetingAbi,
      address: greetingAddress,
      functionName: 'getGreeting',
    })
  
    console.log("read result",result2);
    setGreeting(result2 as string);
  
    return result2;
  } catch (error){
    console.log("error",error);
  }
  }

  const setGreetingFunc : any = async() => {
    try{
      const result = await writeContract(config,{
        abi: GreetingAbi,
        address : greetingAddress,
        functionName:'setGreeting',
        args:[
          newGreeting
        ],

      })

    }
    catch(error){
      console.log("Error",error);
    }
  }
  
  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === 'connected' && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button"
          >
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>
      </div>

      <>
        <div className="">
          <h1> Greeting message: {greeting} </h1>

          <button className="" onClick={getGreeting} > Get Greeting </button>
          <button className="" onClick={setGreetingFunc} > Set Greeting </button>

          <input type="text" className="" placeholder="Enter greeting message" value={newGreeting} onChange={(e) => setNewGreeting(e.target.value)}/>
        </div>
      </>
    </>
  )
}

export default App
