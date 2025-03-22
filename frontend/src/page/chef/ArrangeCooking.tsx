// import * as React from 'react';
// import axios from 'axios';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import AddIcon from '@mui/icons-material/Add';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/DeleteOutlined';
// import SaveIcon from '@mui/icons-material/Save';
// import CancelIcon from '@mui/icons-material/Close';
// import { DataGrid, GridColDef, GridActionsCellItem, GridRowModes, GridRowModesModel } from '@mui/x-data-grid';

// const API_URL = 'https://your-api-url.com/data';

// export default function FullFeaturedCrudGrid() {
//   const [rows, setRows] = React.useState([]);
//   const [rowModesModel, setRowModesModel] = React.useState({});

//   React.useEffect(() => {
//     axios.get(API_URL).then((response) => {
//       setRows(response.data);
//     });
//   }, []);

//   const handleAdd = async () => {
//     const newRow = { name: '', age: '', role: '', isNew: true };
//     const response = await axios.post(API_URL, newRow);
//     setRows([...rows, response.data]);
//   };

//   const handleEditClick = (id) => () => {
//     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
//   };

//   const handleSaveClick = async (id) => {
//     const updatedRow = rows.find((row) => row.id === id);
//     await axios.put(`${API_URL}/${id}`, updatedRow);
//     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
//   };

//   const handleDeleteClick = async (id) => {
//     await axios.delete(`${API_URL}/${id}`);
//     setRows(rows.filter((row) => row.id !== id));
//   };

//   const handleCancelClick = (id) => () => {
//     setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
//   };

//   const columns: GridColDef[] = [
//     { field: 'name', headerName: 'Name', width: 180, editable: true },
//     { field: 'age', headerName: 'Age', type: 'number', width: 80, editable: true },
//     { field: 'role', headerName: 'Role', width: 220, editable: true },
//     {
//       field: 'actions',
//       type: 'actions',
//       headerName: 'Actions',
//       width: 100,
//       getActions: ({ id }) => {
//         const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;
//         return isInEditMode
//           ? [
//               <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={() => handleSaveClick(id)} />,
//               <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={handleCancelClick(id)} />,
//             ]
//           : [
//               <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={handleEditClick(id)} />,
//               <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(id)} />,
//             ];
//       },
//     },
//   ];

//   return (
//     <Box sx={{ height: 500, width: '100%' }}>
//       <Button color="primary" startIcon={<AddIcon />} onClick={handleAdd}>
//         Add record
//       </Button>
//       <DataGrid rows={rows} columns={columns} editMode="row" rowModesModel={rowModesModel} />
//     </Box>
//   );
// }
