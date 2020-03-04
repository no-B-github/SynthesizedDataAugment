displayDialogs = DialogModes.NO;

var mov_val = 0.2
var bg_num = 5
var count = 0

folderObj = Folder.selectDialog("画像ファイルがあるフォルダを選択してください");
fileList = folderObj.getFiles("*.jpg");
//fsname = folderObj.fsName;

maskObj = Folder.selectDialog("マスクファイルがあるフォルダを選択してください");
maskList = maskObj.getFiles("*.png");


for(fCnt=0; fCnt<fileList.length; fCnt++)
{
    str_r = fileList[fCnt].fsName;
    fileObj = new File(str_r);
    flag = fileObj.exists;
    if (flag == true) 
    {
    try{
        fileDoc = app.open(fileObj);
        }
    catch(e)
    {
        alert(fCnt);
        }
    }
 
    mask_r = maskList[fCnt].fsName;
    mask_img = new File(mask_r);
    flag_mask = mask_img.exists;
    if (flag_mask == true) 
    {
      try{
        maskDoc= app.open(mask_img);
        }
    catch(e){
        alert(fCnt);
        }
   
    }

    //// Mask copy to Qick mask  /////////////////////////////////////////////////////
    //activeDocument = maskDoc;
    var Width = activeDocument.width;
    var Height = activeDocument.height;
    
    activeDocument. selection. selectAll();
    activeDocument. selection. copy();

    activeDocument = fileDoc;
    activeDocument. quickMaskMode = true;
    activeDocument. paste();
    activeDocument. quickMaskMode = false;


    // ====Extend selection ===================================================
    var idExpn = charIDToTypeID( "Expn" );
        var desc11 = new ActionDescriptor();
        var idBy = charIDToTypeID( "By  " );
        var idPxl = charIDToTypeID( "#Pxl" );
        desc11.putUnitDouble( idBy, idPxl, 10.000000 );
    executeAction( idExpn, desc11, DialogModes.NO );

    // ===== Fill Content==================================================
    var idFl = charIDToTypeID( "Fl  " );
        var desc12 = new ActionDescriptor();
        var idUsng = charIDToTypeID( "Usng" );
        var idFlCn = charIDToTypeID( "FlCn" );
        var idcontentAware = stringIDToTypeID( "contentAware" );
        desc12.putEnumerated( idUsng, idFlCn, idcontentAware );
        var idOpct = charIDToTypeID( "Opct" );
        var idPrc = charIDToTypeID( "#Prc" );
        desc12.putUnitDouble( idOpct, idPrc, 100.000000 );
        var idMd = charIDToTypeID( "Md  " );
        var idBlnM = charIDToTypeID( "BlnM" );
        var idNrml = charIDToTypeID( "Nrml" );
        desc12.putEnumerated( idMd, idBlnM, idNrml );
    executeAction( idFl, desc12, DialogModes.NO );

    ////// Save /////////////////////////////////////////////////////
    thumbDir = 'cleanBG';
    
    str2 = ".jpg";
    str = fileDoc.name.split(str2);
    var str_dist = str [0]  + "_clenBG_" + ".jpg"; 

    var newDir = new Folder(fileDoc.path +'/'+ thumbDir);
    if(! newDir.exists){ newDir.create();}
    var newFile = new File(fileDoc.path +'/'+ thumbDir +'/'+ str_dist);
    var jpegopt = new JPEGSaveOptions();
    jpegopt.quality = 10; //0(low)〜12(high);
    activeDocument.saveAs(newFile, jpegopt, true);
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    
    ////// BG close /////////////////////////////////////////////////////
    activeDocument = maskDoc;
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
}
