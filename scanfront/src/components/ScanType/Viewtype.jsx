import React, { useEffect, useState } from 'react'
import Adnavbar from '../Navbar/Adnavbar'
import { Box, Button, Grid, Modal, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import Adsidebar from '../Navbar/Adsidebar'
import Edittype from './Edittype'
import axios from 'axios'
import Loader from '../Loader'
import './Viewtype.css';
import EditIcon from '@mui/icons-material/Edit';
import Error from '../Error';
import Success from '../Success';

function Viewtype (){
    const [stypes, setStypes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [selectedStypeId, setSelectedStypeId] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
  
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:3500/stypes');
        setStypes(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError('Failed to fetch data');
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const handleEditStype = (stypeId) => {
      setVisible(true);
      setSelectedStypeId(stypeId);
    };
  
    const handleModalCancel = () => {
      setVisible(false);
      setSelectedStypeId('');
    };
  
    const handleActivateStype = async (stypeId) => {
      try {
        setLoading(true);
        await axios.put(`http://localhost:3500/stypes/activate/${stypeId}`, { display: true });
        fetchData();
        setLoading(false);
        setSuccess('Type activated successfully');
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError('Failed to activate Type');
      }
    };
  
    const handleDeactivateStype = async (stypeId) => {
      try {
        setLoading(true);
        await axios.put(`http://localhost:3500/stypes/deactivate/${stypeId}`, { display: false });
        fetchData();
        setLoading(false);
        setSuccess('Type deactivated successfully');
      } catch (error) {
        console.error(error);
        setLoading(false);
        setError('Failed to deactivate Type');
      }
    };
  
  return (
    <div>
    {loading && <Loader/>}
    {error && <Error message={error} />}
    {success && <Success message={success} />}
    <Adnavbar/>
    <Box height={20}>
      <Box sx={{ display: 'flex' }}>
        <Adsidebar/>
        <Grid className='grid-container'>
          <Paper elevation={10} className='paperstyle'>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Typography variant="h4" sx={{ fontFamily: 'cursive', color: 'rebeccapurple' }}> ScanTypes</Typography>
              <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ color: 'white' }}>ScanType ID</TableCell>
                      <TableCell style={{ color: 'white' }}>ScanType</TableCell>
                      <TableCell style={{ color: 'white' }}>STATUS</TableCell>
                      <TableCell style={{ color: 'white' }}>EDIT</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {stypes.map((value, index) => (
                      <TableRow key={index}>
                        <TableCell style={{ color: 'greenyellow' }}>{value._id}</TableCell>
                        <TableCell style={{ color: 'greenyellow' }}>{value.stype}</TableCell>
                        <TableCell style={{ color: 'greenyellow' }}>
                          {value.display ? (
                            < Button
                              className='deactivate-button'
                              onClick={() => handleDeactivateStype(value._id)}
                              sx={{color:'white',backgroundColor:'red'}}
                                variant='conatined'
                            >
                              Deactivate
                            </Button>
                          ) : (
                            <Button
                              className='activate-button'
                              onClick={() => handleActivateStype(value._id)}
                              sx={{color:'white',backgroundColor:'green'}}
                                variant='conatined'
                            >
                              Activate
                            </Button>
                          )}
                        </TableCell>
                        <TableCell style={{ color: 'white' }}>
                          <EditIcon onClick={() => handleEditStype(value._id)} sx={{color:'rebeccapurple'}}>Edit</EditIcon>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
             
              <Modal
                title='Edit ScanType'
                open={visible} 
                onCancel={handleModalCancel}
                footer={null}
              >
                <Edittype stypeId={selectedStypeId} setLoading={setLoading} setError={setError} setSuccess={setSuccess} />
              </Modal>
            </Box>
          </Paper>
        </Grid>
      </Box>
    </Box>
  </div>
  )
}

export default Viewtype;
