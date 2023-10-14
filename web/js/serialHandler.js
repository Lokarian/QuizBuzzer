class SerialHandler{
  reader;
  writer;
  encoder=new TextEncoder();
  decoder=new TextDecoder();

  async init(){
    if(!navigator.serial){
      alert("Web Serial API not supported. Please use Chrome 89+ on Android or Windows.");
      return;
    }
    try{
      const port=await navigator.serial.requestPort();
      await port.open({baudRate:9600});
      this.reader=port.readable.getReader();
      this.writer=port.writable.getWriter();
      const signals=await port.getSignals();
      console.log(signals);
    }catch(e){
      console.log("Error opening serial port: "+e);
    }
  }
  async write(data){
    const dataArray=this.encoder.encode(data);
    await this.writer.write(dataArray);
  }
  async read(){
    try{
      const readerData=await this.reader.read();
      return this.decoder.decode(readerData.value);
    }catch (e){
      console.log("Error reading from serial port: "+e);
    }
    return "";
  }
}
export default SerialHandler;
