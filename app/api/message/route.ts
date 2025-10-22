import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import Message from "@/models/Message";
import Db from "@/utils/db";
interface DataBody {
  name: FormDataEntryValue | null;
  image?: FormDataEntryValue | null;
  email: FormDataEntryValue | null;
  message: FormDataEntryValue | null;
  service: FormDataEntryValue | null;
  budget: FormDataEntryValue | null;
  isValidImage: FormDataEntryValue | boolean | null;
}

export async function GET(request: Request) {
  // Handle GET requests to /api/users
  const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
  ];
  return new Response(JSON.stringify(users), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(request: NextRequest) {
  try {
    const FormData = await request.formData(); // Assuming JSON body

    const body: DataBody = {
      service: FormData.get("service"),
      budget: FormData.get("budget"),
      name: FormData.get("name"),
      email: FormData.get("email"),
      message: FormData.get("message"),
      isValidImage: FormData.get("isValidImage") === "true" ? true : false,
    };

    if (FormData.get("image")) {
      body.image = FormData.get("image");
    }
    await Db.connect();
    const message = await Message.create(body);
    await Db.disconnect();
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: process.env.NODEMAILER_GMAIL,
        pass: process.env.GMAIL_PASS,
      },
    });
    async function sendMail() {
      const info = await transporter.sendMail({
        from: '"Hey There!!" <Tanviranjum010@gmail.com>',
        to: `${body.email}`,
        subject: "Reply from Tanvir",
        text: "I will be reach you out as soon as possible",
      });

      // console.log("Message sent: %s", info.messageId);
    }
    async function selfmail() {
      const info = await transporter.sendMail({
        from: '"Hey There!!" <Tanviranjum010@gmail.com>',
        to: `tanvirsavagee@gmail.com`,
        subject: "New visitor message",
        text: `Email Address : ${body.email} Message:${body.message} ${message}`,
      });

      // console.log("Message sent: %s", info.messageId);
    }

    await sendMail().catch(console.error);
    await selfmail().catch(console.error);
    return NextResponse.json(
      { message: message, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing POST request:", error);
    return NextResponse.json(
      { error: "Failed to process request", success: false },
      { status: 500 }
    );
  }
}
