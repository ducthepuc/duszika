import React, { useEffect, useState } from 'react';

import axios from 'axios';

const DataFetcher = () => {

  const [data, setData] = useState(null);

  useEffect(() => {

    axios.get('http://localhost:5000/api/data')
      .then(response => {

        console.log(response.data);  // Log the response

        setData(response.data);      // Set the data to state

      })

      .catch(error => {

        console.error('There was an error fetching the data!', error);

      });

  }, []); // The empty dependency array ensures the request runs once when the component mounts

  return (
<div>
<h1>Data from API:</h1>

      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading data...</p>}
</div>

  );

};

export default DataFetcher;