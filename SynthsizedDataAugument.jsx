displayDialogs = DialogModes.NO;

var mov_val = 0.2
var bg_num = 5
var count = 0

folderObj = Folder.selectDialog("Frontファイルがあるフォルダを選択してください");
fileList = folderObj.getFiles("*.jpg");

var maskObj = Folder.selectDialog("マスクファイルがあるフォルダを選択してください");
maskList = maskObj.getFiles("*.png");

var bgObj = Folder.selectDialog("背景ファイルがあるフォルダを選択してください");
bgList = bgObj.getFiles("*.jpg");

for(bgCnt=0; bgCnt<bg_num; bgCnt++)
{
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
    var Width = activeDocument.width;
    var Height = activeDocument.height;
    
    activeDocument. selection. selectAll();
    activeDocument. selection. copy();

    activeDocument = fileDoc;
    activeDocument. quickMaskMode = true;
    activeDocument. paste();
    activeDocument. quickMaskMode = false;

    activeDocument. selection. copy();
    activeDocument. paste();
    
    rand = Math.random();

    var dx = UnitValue( (Math.random() *2 - 1)*Width*mov_val , "px"); 
    var dy = UnitValue( (Math.random() *2 - 1)*Height*mov_val , "px"); 
    
    var size_high = 100 + 100*Math.random()*mov_val;
    var size_width  = 100 + 100*Math.random()*mov_val*2;
     
    activeDocument. layers[0]. translate( dx *0.4, dy*0.1 ); 
   activeDocument. layers[0]. resize( size_width,  size_high, AnchorPosition. MIDDLECENTER );

    /////// Flip val ///////
    
    var flip = false;
    if (rand > 0.5) 
    {
        flip = true;
    }

    if (flip == true) 
    {
        activeDocument. flipCanvas( Direction. HORIZONTAL);
    }

     //// Mask Doc save &  Close /////////////////////////////////////////////////////
    activeDocument = maskDoc;
    activeDocument. selection. selectAll();
    activeDocument. selection. copy();
    activeDocument. paste();

    activeDocument. layers[0]. translate( dx *0.4, dy*0.1  ); 
    activeDocument. layers[0]. resize( size_width,  size_high, AnchorPosition. MIDDLECENTER );
    
    if (flip == true) 
    {
        activeDocument. flipCanvas( Direction. HORIZONTAL);
    }
    
    //Fill Black
    activeDocument. artLayers. add();
    RGBColor = new SolidColor();
    RGBColor.red = 0;
    RGBColor.green = 0;
    RGBColor.blue = 0;
    activeDocument. selection. selectAll();
    activeDocument.selection.fill(RGBColor,ColorBlendMode.NORMAL, 100, false);
    
    //Move Layer
    var bg_srcLayerSetObj = activeDocument. layers[1]; 
    var bg_dstLayerSetObj = activeDocument. layers[0];
    bg_srcLayerSetObj. move( bg_dstLayerSetObj, ElementPlacement. PLACEBEFORE);
    
    activeDocument. flatten();


    ////////// Save New Mask /////////////////////////////////////////////////////////////////////////////////////////
    thumbDir = 'result';
    
    str2 = ".jpg";
    str = maskDoc.name.split(str2);
    var str_dist = "mask_"  + count + ".jpg"; 
    
    var newDir = new Folder(maskDoc.path +'/'+ thumbDir);
    if(! newDir.exists){ newDir.create();}
    var newFile = new File(maskDoc.path +'/'+ thumbDir +'/'+ str_dist);
    var jpegopt = new JPEGSaveOptions();
    jpegopt.quality = 10; //0(low)〜12(high);
    activeDocument.saveAs(newFile, jpegopt, true);
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    
    //// Bg Doc Copy /////////////////////////////////////////////////////
    min = 0;
    max= bgList.length;
    randomNumber = Math.floor(Math.random() * (max - 1));
    
    bg_r = bgList[randomNumber].fsName;
    bg_img = new File(bg_r);
    flag = bg_img.exists;
    if (flag == true) 
    {
        try{
        open(bg_img);
        bgDoc= activeDocument;
        }
    catch(e){
        alert(randomNumber);
        }
    }

    if (Math.random() > 0.5) 
    {
        app.activeDocument. flipCanvas( Direction. HORIZONTAL);
    }

    activeDocument. selection. selectAll();
    activeDocument. selection. copy();
    activeDocument = fileDoc;
    activeDocument. paste();


    ///////// Resize /////////////////////////////////////////////////////
    var canvasWidth = activeDocument.width;
    var canvasHeight = activeDocument.height;
    var layer = activeDocument. layers[0]
    var layerX = layer.bounds[0];
    var layerY = layer.bounds[1];
    var layerWidth = layer.bounds[2] - layerX;
    var layerHeight = layer.bounds[3] - layerY;
    var rate;
     
    if(layerHeight * (canvasWidth / layerWidth)>= canvasHeight){
        rate = Math.ceil((canvasWidth / layerWidth) * 10000) / 100;
    } else {
        rate = Math.ceil((canvasHeight / layerHeight) * 10000) / 100;
    }
     
    layer.resize(rate*1.1, rate*1.1);
     
    layerX = layer.bounds[0];
    layerY = layer.bounds[1];
    layerWidth = layer.bounds[2] - layerX;
    layerHeight = layer.bounds[3] - layerY;
     
    layer.translate(((canvasWidth - layerWidth) / 2) - layerX + (Math.random()*2 - 1)* layerX*0.3, ((canvasHeight - layerHeight) / 2) - layerY );

    activeDocument = fileDoc;
    srcLayerSetObj = activeDocument.layers[1]; 
    dstLayerSetObj = activeDocument.layers[0];
    srcLayerSetObj. move( dstLayerSetObj, ElementPlacement. PLACEBEFORE);

    ////// Base Layer delete /////////////////////////////////////////////////////
    activeDocument. layers[2]. remove();

    ////// Save /////////////////////////////////////////////////////
    activeDocument. flatten();

    str2 = ".jpg";
    str = fileDoc.name.split(str2);
    var str_dist = "photo_"  + count + ".jpg"; 
    
    var newDir = new Folder(fileDoc.path +'/'+ thumbDir);
    if(! newDir.exists){ newDir.create();}
    var newFile = new File(fileDoc.path +'/'+ thumbDir +'/'+ str_dist);
    var jpegopt = new JPEGSaveOptions();
    jpegopt.quality = 10; //0(low)〜12(high);
    activeDocument.saveAs(newFile, jpegopt, true);
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    
    ////// BG close /////////////////////////////////////////////////////
    activeDocument = bgDoc;
    activeDocument.close(SaveOptions.DONOTSAVECHANGES);
    
    count  = count  + 1;
}
}