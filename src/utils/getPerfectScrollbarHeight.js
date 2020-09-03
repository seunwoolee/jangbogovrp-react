export default (rowsPerPage: number, length: number, defaultHeight: number) => {
    if(length > rowsPerPage){
      return rowsPerPage * defaultHeight;
    }
    if(length * defaultHeight < 300){
      return 300;
    }
    return length * defaultHeight;
};
