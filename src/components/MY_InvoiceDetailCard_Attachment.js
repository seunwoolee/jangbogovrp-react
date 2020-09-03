import React from 'react';
import PropTypes from 'prop-types';
import FilesDropzone from "./FilesDropzone";
import MY_attachments from "./MY_attachments";


function MY_InvoiceDetailCard_Attachment({
   invoiceId, attachments, handleAttachments, type, openAttachment, setOpenAttachment, selectedImgPath, setSelectedImgPath
}) {
  if (type === 'write') {
    return <FilesDropzone
      invoiceId={invoiceId}
      attachments={attachments}
      handleAttachments={handleAttachments}/>
  } else if (type === 'read') {
    return <MY_attachments
      selectedImgPath={selectedImgPath}
      setSelectedImgPath={setSelectedImgPath}
      openAttachment={openAttachment}
      setOpenAttachment={setOpenAttachment}
      attachments={attachments.filter(attachment => attachment.invoice === invoiceId)}/>
  } else {
    return null;
  }
}

MY_InvoiceDetailCard_Attachment.propTypes = {
  invoiceId: PropTypes.string.isRequired,
  attachments: PropTypes.array.isRequired,
  handleAttachments: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
  openAttachment: PropTypes.bool,
  setOpenAttachment: PropTypes.func,
  selectedImgPath: PropTypes.string,
  setSelectedImgPath: PropTypes.func,
};

export default MY_InvoiceDetailCard_Attachment;
