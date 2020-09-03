import React, {useEffect, useState} from "react";
import {INVOICETYPE} from "../views/My_ReportCreate";
import MY_InvoiceDetailCard from "../components/MY_InvoiceDetailCard";
import MY_InvoiceDetailCard_P from "../components/MY_InvoiceDetailCard_P";
import MY_InvoiceDetailCard_R from "../components/MY_InvoiceDetailCard_R";
import MY_InvoiceDetailCard_G from "../components/MY_InvoiceDetailCard_G";

export default (document_type: string, invoices: Array, attachments: Array, type='read', handleAttachments=null) => {
  const [openAttachment, setOpenAttachment] = useState('None');
  const [selectedImgPath, setSelectedImgPath] = React.useState('');

  useEffect(() => {
    setOpenAttachment('None');
  }, attachments)

  let invoiceDetailCard = null;
  if (document_type === INVOICETYPE.채무발생 || document_type === INVOICETYPE.채권발생) {
    invoiceDetailCard = (
      <MY_InvoiceDetailCard
        type={type}
        invoices={invoices}
        attachments={attachments}
        handleAttachments={handleAttachments}
        openAttachment={openAttachment}
        setOpenAttachment={setOpenAttachment}
        selectedImgPath={selectedImgPath}
        setSelectedImgPath={setSelectedImgPath}
      />
    )
  } else if (document_type === INVOICETYPE.채무정리) {
    invoiceDetailCard = (
      <MY_InvoiceDetailCard_P
        type={type}
        invoices={invoices}
        attachments={attachments}
        handleAttachments={handleAttachments}
        openAttachment={openAttachment}
        setOpenAttachment={setOpenAttachment}
        selectedImgPath={selectedImgPath}
        setSelectedImgPath={setSelectedImgPath}
      />
    )
  } else if (document_type === INVOICETYPE.채권정리) {
    invoiceDetailCard = (
      <MY_InvoiceDetailCard_R
        type={type}
        invoices={invoices}
        attachments={attachments}
        handleAttachments={handleAttachments}
        openAttachment={openAttachment}
        setOpenAttachment={setOpenAttachment}
        selectedImgPath={selectedImgPath}
        setSelectedImgPath={setSelectedImgPath}
      />
    )
  } else if (document_type === INVOICETYPE.일반전표) {
    invoiceDetailCard = (
      <MY_InvoiceDetailCard_G
        type={type}
        invoices={invoices}
        attachments={attachments}
        handleAttachments={handleAttachments}
        openAttachment={openAttachment}
        setOpenAttachment={setOpenAttachment}
        selectedImgPath={selectedImgPath}
        setSelectedImgPath={setSelectedImgPath}
      />
    )
  }
  return invoiceDetailCard;
};

