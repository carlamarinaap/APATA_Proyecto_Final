/* --------CAPA DE INTERACCION---------- */
/*
App ID: 848187

Client ID: Iv1.6d1c1b3a5778cb34
ClientSecret: 551f13b31eb6eb2b526ac1cf0ca51af93a564b4c
*/

// Libs
import express from "express";
import expressHandlebars from "express-handlebars";
import Handlebars from "handlebars";
import { allowInsecurePrototypeAccess } from "@handlebars/allow-prototype-access";
import { Server } from "socket.io";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import { addLogger } from "./config/logger.js";
import swaggerJSDOC from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

// Managers
import ProductManager from "./dao/manager_mongo/productManager.js";
import MessageManager from "./dao/manager_mongo/messageManager.js";
import UserManager from "./dao/manager_mongo/userManager.js";

//Routes
import routerProducts from "./routes/products.router.js";
import routerCarts from "./routes/carts.router.js";
import routerSession from "./routes/session.router.js";
import routerViews from "./routes/views.router.js";
import routerUser from "./routes/user.router.js";

import { __dirname } from "./utils.js";
import initializePassport from "./config/passport.config.js";
import config from "./config/config.js";
import { productService } from "./repositories/index.js";
import { port } from "./commander.js";
import { transport } from "./controllers/products.controller.js";

const app = express();

const httpServer = app.listen(port, () => console.log("Server running in port " + port));
const socketServer = new Server(httpServer);

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentación del E Commerce de APATA",
      description:
        "Aquí se encuentra la documentación del manejo de productos y carritos",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDOC(swaggerOptions);
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(specs));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(config.privateKey));
app.use(addLogger);

//Database
mongoose.connect(config.mongoUrl);

initializePassport();
app.use(
  session({
    secret: config.privateKey,
    resave: true,
    saveUninitialized: true,
  })
);

// Views
app.use(express.static(__dirname + "/public"));
app.use("/api/products", routerProducts);
app.use("/api/carts", routerCarts);
app.use("/api/sessions", routerSession);
app.use("/api/users", routerUser);
app.use("/", routerViews);

app.engine(
  "handlebars",
  expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

/* --------Test de vida del servidor---------- */
app.get("/ping", (req, res) => res.status(200).send("Pong!"));
/* ------------------------------------------- */

const pm = new ProductManager();
const mm = new MessageManager();
const um = new UserManager();

socketServer.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", async (data) => {
    const { newProduct, owner } = data;
    await productService.add(newProduct);
    const products = await productService.get({});
    const allProducts = await productService.get({ limit: products.totalDocs });
    let added = true;
    socketServer.emit("card", { allProducts, owner, added });
  });

  socket.on("deleteProduct", async (data) => {
    const { prod, owner } = data;
    const product = await pm.getProductById(prod);
    const products = await productService.get({});
    if (product.owner === owner || owner === "admin") {
      await pm.deleteProduct(prod);
      const allProducts = await productService.get({ limit: products.totalDocs });
      let deleted = true;
      if (owner !== "admin") {
        const user = await um.getUserByEmail(owner);
        socketServer.emit("card", { allProducts, owner, deleted });
        let result = await transport.sendMail({
          from: "Carla del Proyecto de Coder <carla.apata@gmail.com>",
          to: `${user.first_name} ${user.last_name} <${user.email}>`,
          subject: "Se eliminó un producto",
          html: `
                <div style="background-color: #f2f2f2; padding: 20px; text-align: center;">
                  <h3 style="color: #28a745;">Se ha eliminado el producto <span style="color: #280000;"> ${product.title}</span> con id<span style="color: #280000;"> ${product._id}</span> </h3>
                  <p style="color: #333333;">Si no fuiste vos por favor contactate con nosotros para mayor asesoramiento</p>
                </div>
                `,
          attachments: [],
        });
      }
    } else {
      const allProducts = await productService.get({ limit: products.totalDocs });
      socketServer.emit("card", { allProducts, owner });
    }
  });

  // Socket UsersAdmin
  socket.on("deleteUser", async (data) => {
    const { id } = data;
    await um.deleteUser(id);
    const users = await um.getUsers({});
    let deleted = true;
    socketServer.emit("cardAdmin", { users, deleted });
  });

  socket.on("changeRoleUser", async (data) => {
    const { id } = data;
    await um.updateRole(id);
    const users = await um.getUsers({});
    let updated = true;
    socketServer.emit("cardAdmin", { users, updated });
  });
  // Socket /chat
  socket.on("login", async (data) => {
    const messages = await mm.getMessages();
    socketServer.emit("chat", messages);
  });
  socket.on("newMessage", async (data) => {
    await mm.addMessage(data);
    const messages = await mm.getMessages();
    socketServer.emit("chat", messages);
  });
  socket.on("clearChat", async () => {
    await mm.clearChat();
    const messages = await mm.getMessages();
    socketServer.emit("chat", messages);
  });
});

app.get("/loggerTest", (req, res) => {
  try {
    req.logger.FATAL("Hola");
    req.logger.ERROR("Hola");
    req.logger.INFO("Hola");
    req.logger.WARN("Hola");
    req.logger.DEBUG("Hola");
    res.status(200).send("Log generado correctamente");
  } catch (error) {
    req.logger.ERROR("Error al generar el log:", error);
    res.status(500).send("Error al generar el log");
  }
});
