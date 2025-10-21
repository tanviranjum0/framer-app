// https://www.geeksforgeeks.org/javascript/how-to-convert-base64-to-file-in-javascript/ ||For Base64 to file
// https://www.geeksforgeeks.org/javascript/how-to-convert-image-into-base64-string-using-javascript/ ||For image to Base64
"use client";
import React from "react";

export const imageToBase64 = ({
  file,
  setSelectedImageBase64,
}: {
  file: Blob | File;
  setSelectedImageBase64: React.Dispatch<React.SetStateAction<string>>;
}) => {
  if (!file) return;
  let base64String = "";
  const reader = new FileReader();
  reader.onload = function () {
    if (reader.result) {
      base64String = (reader.result as string)
        .replace("data:", "")
        .replace(/^.+,/, "");
    }
    setSelectedImageBase64(base64String);
  };
  reader.readAsDataURL(file);
};

export const base64ToImage = (
  Bstring: string,
  mimeType: string,
  fileName: string
) => {
  // Remove data URL scheme if present
  const base64Data = Bstring.replace(/^data:.+;base64,/, "");
  const byteCharacters = atob(base64Data); // Decode Base64 string
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const fName = fileName;
  const fileOptions = {
    type: blob.type,
    lastModified: new Date().getTime(), // Optional: set last modified date
  };
  const myFile = new File([blob], fName, fileOptions);
  console.log(myFile);

  // document
  //   .getElementById("testingIma ge")
  //   ?.setAttribute("src", URL.createObjectURL(myFile));

  // // Create a link element to download the file
  // const link = document.createElement("a");
  // link.href = url;
  // link.download = fileName;
  // link.click();

  // Cleanup
  URL.revokeObjectURL(url);
};
