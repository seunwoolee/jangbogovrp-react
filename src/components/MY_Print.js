import React, {useEffect, useState} from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {useLocation} from "react-router";
import MY_approverLine from "./MY_approverLine";
import axios from "../utils/my_axios";
import getInvoiceDetailCard from "../utils/getInvoiceDetailCard";
import Box from "@material-ui/core/Box";

function MY_Print() {
  const location = useLocation();
  const url = `ea/document/`;
  const params = new URLSearchParams(location.search);
  const [document, setDocument] = useState(null);

  useEffect(() => {
    const config = {
      headers: {Authorization: `Token ${localStorage.getItem('token')}`},
      params: {document_id: params.get('documentId')}
    };

    axios.get(url, config)
      .then((response) => {
        setDocument(response.data);
      });
  }, []);

  return (
    <>
      {document ? (
        <>
          <Box pb={2} pt={2}>
            <MY_approverLine signs={document.signs} />
          </Box>
          <Box pb={2} pt={2}>
          <TableContainer component={Paper}>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>작성자</TableCell>
                  <TableCell>{document.author}</TableCell>
                  <TableCell>작성일자</TableCell>
                  <TableCell>{document.created}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>제목</TableCell>
                  <TableCell>{document.title}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
          {getInvoiceDetailCard(document.document_type, document.invoices, document.attachments, null)}
        </>
        ) : null}

    </>
  );
}

export default MY_Print;
