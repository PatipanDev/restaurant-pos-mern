import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import { DataGrid, GridColDef, GridRowModes, GridRowModesModel, GridActionsCellItem } from '@mui/x-data-grid';
import axios from 'axios';

interface IngredientDetail {
  _id: string; // MongoDB ObjectId
  IngredientDt_Qua: number;
  IngredientDt_Unit: string;
  ingredient_id: string; // ObjectId of Ingredient
  item_id: string;     // ObjectId of Product
  isNew?: boolean;
}

interface IngrediendetailsProps {
  id: string;
  name: string;
  onClose: () => void;
}

const Ingrediendetails: React.FC<IngrediendetailsProps> = ({ id, name, onClose }) => {
  const [rows, setRows] = useState<IngredientDetail[]>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});

   const [products, setProduct] = useState<any[]>([]); // To store units

  useEffect(() => {
    const getIngredientDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/data/getIngredientDetails/${id}`);
        setRows(response.data); // ตั้งค่าข้อมูลจาก API

        const ProductResponse = await axios.get('http://localhost:3000/api/data/getunits');
        setProduct(ProductResponse.data);
        console.log(ProductResponse.data)

      } catch (error: any) {
        console.error("Error fetching ingredient details", error);
      }
    };

    if (id) {
      getIngredientDetails(); // เรียก API เมื่อ id เปลี่ยน
    }
  }, [id]);

  const handleEditClick = (id: string) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id: string) => async () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });

    const updatedRow = rows.find((row) => row._id === id);
    if (updatedRow) {
      try {
        const response = await axios.put(`http://localhost:3000/api/data/updateIngredientDetail/${id}`, updatedRow); // API Endpoint
        setRows(rows.map((row) => (row._id === id ? response.data : row)));
      } catch (error) {
        console.error('Error updating ingredient detail', error);
      }
    }
  };

  const handleDeleteClick = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/data/deleteIngredientDetail/${id}`);
      setRows((oldRows) => oldRows.filter((row) => String(row._id) !== id)); // ✅ ป้องกัน _id null
    } catch (error) {
      console.error("Error deleting ingredient detail", error);
    }
  };
  
  const handleCancelClick = (id: string) => {
    setRowModesModel((prevModel) => ({
      ...prevModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    }));
  
    const editedRow = rows.find((row) => String(row._id) === id);
    if (editedRow?.isNew) {
      setRows(rows.filter((row) => String(row._id) !== id));
    }
  };
  
  const handleAddClick = async () => {
    const newRow = {
      IngredientDt_Qua: 0,
      IngredientDt_Unit: "",
      ingredient_id: id,
      item_id: "",
      isNew: true,
    };
  
    try {
      const response = await axios.post(
        "http://localhost:3000/api/data/addIngredientDetail",
        newRow
      );
      setRows((oldRows) => [...oldRows, response.data]);
      setRowModesModel((oldModel) => ({
        ...oldModel,
        [String(response.data._id)]: { mode: GridRowModes.Edit, fieldToFocus: "IngredientDt_Qua" },
      }));
    } catch (error) {
      console.error("Error adding new ingredient detail", error);
    }
  };
  
  const columns: GridColDef[] = [
    { field: "IngredientDt_Qua", headerName: "Quantity", type: "number", width: 100, editable: true },
    { field: "IngredientDt_Unit", headerName: "Unit", width: 100, editable: true },
    { field: "ingredient_id", headerName: "Ingredient ID", width: 200, editable: true },
    { field: "item_id", headerName: "Item ID", width: 200, editable: true },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[String(id)]?.mode === GridRowModes.Edit;
        return isInEditMode
          ? [
              <GridActionsCellItem icon={<SaveIcon />} label="Save" onClick={() => handleSaveClick(String(id))} />,
              <GridActionsCellItem icon={<CancelIcon />} label="Cancel" onClick={() => handleCancelClick(String(id))} />,
            ]
          : [
              <GridActionsCellItem icon={<EditIcon />} label="Edit" onClick={() => handleEditClick(String(id))} />,
              <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(String(id))} />,
            ];
      },
    },
  ];
  
  return (
    <Box sx={{ height: 500, width: "100%" }}>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleAddClick}>
        Add Ingredient Detail
      </Button>
      <Button onClick={onClose} variant="contained" startIcon={<DeleteIcon />}>
        ปิดหน้ารายละเอียด
      </Button>
      <Button>{name}</Button>
      <DataGrid rows={rows} columns={columns} rowModesModel={rowModesModel} getRowId={(row) => String(row._id)} />
    </Box>
  );
}
  
  export default Ingrediendetails;
  