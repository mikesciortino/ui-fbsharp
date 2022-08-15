import { data } from 'autoprefixer';
import axios from 'axios';
import React, {useState, useEffect, useMemo} from 'react';
import logo from './logo.svg';
import Table from "./Table";

function Ranks(){
  const [loadingData, setLoadingData] = useState(true);
  const [data, setData] = useState([]);
  const columns = useMemo(() => [
      {
        Header: "Player ID",
        accessor: "player_id",
      },
      {
        Header: "First Name",
        accessor: "first_name",
      },
      {
        Header: "Last Name",
        accessor: "last_name",
      },
      {
        Header: "Team",
        accessor: "team",
      },
    ]);
   
    useEffect(() => {
      async function getData(){
        await axios
          .get("http://127.0.0.1:8000/players/")
          .then((response) => {
            console.log(response.data);
            setData(response.data);
            setLoadingData(false);
          });
      }
      if (loadingData) {
        getData();
      }
    }, )

  return (  
    <div className="App">
      <header className="App-header">
        <h1> Ranks</h1>
        {loadingData ? (
          <p>Loading Data...</p>
        ):(
          <Table columns={columns} data={data} />
        )}
      </header>
      
    </div>
  );
  
}

export default Ranks;
