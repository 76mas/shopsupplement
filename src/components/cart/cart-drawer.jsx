"use client";
import * as React from "react";
import { Drawer } from "@base-ui/react/drawer";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import styles from "./cart.module.css";
import Container from "@/components/container";
import { useCart } from "@/context/cart-context";


const Emptycart=()=>(
  <svg xmlns="http://www.w3.org/2000/svg" width="3em" height="3em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
		<path d="M9.753 9.406q.649.427 1.25.92l.66.5q.114.099.24.18a.56.56 0 0 0 .44.05a1.1 1.1 0 0 0 .43-.26a2.3 2.3 0 0 0 .32-.41l.721-1.41l.73-1.23a.32.32 0 0 0-.181-.494a.31.31 0 0 0-.329.123l-.91 1.16l-.86 1.24a7.2 7.2 0 0 1-.81-2.74a5.07 5.07 0 0 1 .54-2.81a2 2 0 0 0 .12-.25q.15.128.32.23c.216.12.449.21.69.27a1.8 1.8 0 0 0 2.27-1.291c.07-.6-.24-1.27-1.34-1.44a2.15 2.15 0 0 0-1.58.39l-.14.1a1.78 1.78 0 0 1 1.23-1.42a3.27 3.27 0 0 1 2.43.16a.28.28 0 1 0 .26-.49a3.85 3.85 0 0 0-3.5-.12a2.52 2.52 0 0 0-1.36 2.13a1.7 1.7 0 0 0 .11.67a5 5 0 0 0-.36.64a5.9 5.9 0 0 0-.48 3.331a7.5 7.5 0 0 0 .64 2.16c-.28-.16-.55-.32-.85-.47a26 26 0 0 0-1.801-.78a.284.284 0 1 0-.25.51c.45.26.9.55 1.35.85m3.1-6.262a1.24 1.24 0 0 1 1.001-.35c.35.05.51.2.41.39a.87.87 0 0 1-.94.33a1.5 1.5 0 0 1-.42-.16a1 1 0 0 1-.19-.11z" />
		<path d="M16.995 7.455c.27-.088.56-.088.83 0c.28.15.47.51.83 1.12c.384.903.637 1.857.75 2.831a3.2 3.2 0 0 1 0 .9c-.05.19-.13.34-.32.37s-.7 0-1.34 0h-5.701c-1.37.06-3.051 0-4.472 0c-1 0-1.82-.09-2.35-.16h-.3a1.7 1.7 0 0 1-.07-.3c.049-.853.207-1.697.47-2.51a3.33 3.33 0 0 1 .81-1.73a1.4 1.4 0 0 1 .56-.19q.335-.029.67 0a.282.282 0 0 0 .06-.56a3.5 3.5 0 0 0-.94 0a2.1 2.1 0 0 0-.63.21c-.6.29-1.28 1.78-1.64 3.15a6 6 0 0 0-.22 2.16a.76.76 0 0 0 .28.46c1.036.324 2.114.496 3.2.51c1.45.1 3.161.13 4.562.09c.54 0 3.06 0 5-.08a20 20 0 0 0 2.201-.14c.72-.15 1.06-.79 1.06-1.69a10.5 10.5 0 0 0-1-3.69c-.49-.75-.79-1.161-1.15-1.331a1.8 1.8 0 0 0-1.26 0a.31.31 0 0 0-.24.38a.31.31 0 0 0 .35.2m-8.612 9.843c-.34-1.08-.84-.88-.81 0v.57a6 6 0 0 1-.12 1.53l-.13.47l-.2.29c0-.06-.08-.15-.12-.21a4.3 4.3 0 0 1-.36-.86l-.39-1.38c0-.15-.06-.29-.1-.44c-.371-1.09-.771-.67-.801 0c0 .2 0 .4.06.59l.26 1.49q.126.546.37 1.05c.138.292.352.54.62.72a1 1 0 0 0 1.33-.25l.2-.27a2 2 0 0 0 .27-.62c0-.11 0-.21.06-.4a7 7 0 0 0 0-1.78c-.08-.17-.11-.33-.14-.5m4.172 0v.72a6.5 6.5 0 0 1-.38 1.71a1 1 0 0 1-.46.55c-.09 0-.16 0-.22-.18a2.3 2.3 0 0 1-.22-.81c-.07-.51-.07-1-.1-1.5v-.49c-.14-1-.72-1-.78 0v.51c0 .48-.08 1-.06 1.56c.013.402.098.798.25 1.17a1.19 1.19 0 0 0 1.23.82a1.86 1.86 0 0 0 1.39-1.28c.19-.65.288-1.323.29-2v-.77c-.21-1.08-.87-.96-.94-.01m4.441 0c-.06.23-.11.45-.18.67a6 6 0 0 1-.69 1.55l-.31.4l-.27.24a3 3 0 0 0 0-.29a5 5 0 0 1 0-.94l.16-1.39v-.25c0-1.08-.67-1.1-.8 0v.15l-.31 1.33a5.4 5.4 0 0 0-.08 1.38c.018.264.104.52.25.74c.26.38.7.61 1.39.15l.47-.41l.42-.6a6.6 6.6 0 0 0 .54-1.38q.174-.672.27-1.36c.14-1.08-.54-.95-.86.01" />
		<path d="M22.856 13.727a17 17 0 0 0-.6-3.051a55 55 0 0 0-.7-2.71a19 19 0 0 0-.56-1.791a4.8 4.8 0 0 0-.43-1a.81.81 0 0 0-.58-.43c-.66-.06-1.13-.12-1.64-.15h-1.121a.32.32 0 0 0-.32.32a.33.33 0 0 0 .31.32c.41 0 .75 0 1.07.06l1.59.18c.18.37.38.81.45 1c.19.52.37 1.12.54 1.74c.25.92.46 1.88.63 2.691c.05.24.261 1 .391 1.82q.117.585.11 1.18q.01.09 0 .18a4.6 4.6 0 0 1-1.74.54a22.5 22.5 0 0 1-3.071.17h-4.601c-2.32 0-4.651-.08-6.932-.16a10.4 10.4 0 0 1-2.36-.26a2 2 0 0 1-1.13-.69c-.15-.2-.07-.58 0-1c.16-.74.49-1.54.6-1.92c.255-1.126.6-2.23 1.03-3.3a2.7 2.7 0 0 1 1.39-1.491q.488-.152 1-.17q.828-.034 1.65.06a.27.27 0 0 0 .31-.24a.28.28 0 0 0-.24-.31a13 13 0 0 0-1.71-.16c-.406 0-.81.057-1.2.17a2.92 2.92 0 0 0-1.5 1.28a17 17 0 0 0-1.55 4q-.468 1.143-.761 2.341a1.94 1.94 0 0 0 .15 1.33a2.8 2.8 0 0 0 1.46 1.001c0 .79.06 1.57.13 2.35c.09 1 .22 2.051.38 3.061c.08.46.09 1 .22 1.46c.07.251.18.488.33.7a1.8 1.8 0 0 0 .83.571q.588.184 1.201.24q.63.09 1.26.12c1 .06 1.91.06 2.881.11c1.43.06 2.82.14 4.221.1a20 20 0 0 0 2.84-.3a14 14 0 0 0 1.561-.2a1.6 1.6 0 0 0 .8-.46c.261-.338.448-.726.55-1.14q.198-.796.29-1.61c.12-.92.26-1.841.38-2.761c.08-.62.16-1.24.21-1.86a.24.24 0 0 0-.05-.16a5.2 5.2 0 0 0 1.681-.671a1.25 1.25 0 0 0 .35-1.1m-2.86 3.69c-.15.91-.32 1.831-.48 2.731a13 13 0 0 1-.32 1.5a2.3 2.3 0 0 1-.39.78a.85.85 0 0 1-.53.19c-.481.07-1.001.06-1.311.1q-1.353.197-2.72.201c-1.371 0-2.732-.05-4.152-.11c-1 0-1.91 0-2.87-.08c-.4 0-.8 0-1.2-.07a5 5 0 0 1-1.001-.15a.94.94 0 0 1-.42-.25a1.3 1.3 0 0 1-.25-.56c-.1-.38-.14-.81-.21-1.18q-.315-1.5-.51-3.001c-.1-.7-.16-1.4-.21-2.11c2.47.57 14.313.59 16.834.18c-.11.62-.2 1.23-.26 1.83" />
	</g>
</svg>
)
    

export default function CartDrawer() {
  const { items, open, setOpen, updateQuantity, removeItem, total } = useCart();
  const router = useRouter();

  return (
    <Drawer.Root
      open={open}
      onOpenChange={setOpen}
      swipeDirection="up"
      dismissible={true}
    >
      <Drawer.Portal>
        <Drawer.Backdrop className={styles.Backdrop} />
        <Drawer.Viewport className={styles.Viewport}>
          <Drawer.Popup className={styles.Popup} dir="rtl">

            <Container className="mx-auto">
              <div className="flex justify-between items-center text-black px-6 pt-8 mb-4">
                <div className="flex flex-col">
                  <Drawer.Title className="text-2xl font-black">سلة المشتريات</Drawer.Title>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                    {items.length} {items.length === 1 ? "منتج" : "منتجات"}
                  </p>
                </div>
                <Drawer.Close className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </Drawer.Close>
              </div>
            </Container>

            <Drawer.Content className={styles.Scroll}>
              <Container className="mx-auto">
                <div className="flex flex-col gap-6 mt-4 pb-10">
                  <AnimatePresence mode="popLayout">
                    {items.map((item) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                        key={item.key}
                        className="flex gap-4 items-center border-b border-gray-50 pb-6 group"
                      >
                        {/* Image */}
                        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0 border border-black/5">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-300 text-xs">لا صورة</div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col gap-1 pr-2">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-black text-sm line-clamp-1">{item.name}</h4>
                            <button
                              onClick={() => removeItem(item.key)}
                              className="text-gray-300 hover:text-red-500 cursor-pointer  transition-colors"
                            >
                    <svg xmlns="http://www.w3.org/2000/svg" width="1.5em" height="1.5em" viewBox="0 0 24 24">
	<path d="M0 0h24v24H0z" fill="none" />
	<g fill="currentColor" fill-rule="evenodd" clip-rule="evenodd">
		<path d="M22.049 7.077a4 4 0 0 1-1.001 0c-.85-.09-1.822-.31-2.573-.38a62 62 0 0 0-4.764-.3c-1.612-.03-3.203 0-4.765.11l-4.614.31a.31.31 0 0 0 .12-.26c.12 0 .12-.5.14-.56q.114-.321.32-.591a1 1 0 0 1 .46-.34q1.186-.38 2.413-.591a26.5 26.5 0 0 1 3.734-.35c1.436-.1 2.878-.1 4.314 0c.948.055 1.887.21 2.803.46a.59.59 0 0 1 .35.37q.125.393.17.801a.36.36 0 0 0 .39.29a.34.34 0 0 0 .29-.39a3.8 3.8 0 0 0-.23-1.151a1.23 1.23 0 0 0-.73-.68a14.2 14.2 0 0 0-3.003-.701s-.58-1.512-.59-1.522A3.8 3.8 0 0 0 14.21.411a2.64 2.64 0 0 0-1.651-.4a5.1 5.1 0 0 0-1.522.36c-.507.221-.95.565-1.291 1a7.6 7.6 0 0 0-.66 1.843c-.281 0-.581.08-.862.14a15.3 15.3 0 0 0-3.143 1a1.85 1.85 0 0 0-.64.491c-.224.3-.387.64-.48 1.001q-.092.346-.14.7a.38.38 0 0 0 .09.281l.07.02c-3.544.25-2.273.831-2.003.821q.339-.02.671-.08h6.336c1.301 0 2.623-.06 3.954-.07h2.643c1 0 1.891 0 2.822.06c.741 0 1.722.19 2.573.24c.399.048.802.048 1.201 0a.34.34 0 0 0 .28-.39a.352.352 0 0 0-.41-.35m-11.59-5.065a2.5 2.5 0 0 1 .77-.47a4.8 4.8 0 0 1 1.442-.341a1.63 1.63 0 0 1 1 .15c.344.198.649.456.902.76c.05.07.27.591.44.942a30 30 0 0 0-3.543-.04c-.48 0-.971 0-1.482.07c.23-.37.38-1.011.47-1.071m10.191 6.646a.31.31 0 0 0-.43 0a.32.32 0 0 0 0 .38v.37a39 39 0 0 1-.571 4.765c-.34 2.062-.751 4.164-1.061 5.235c-.14.491-.24 1.001-.41 1.482c-.092.28-.227.544-.401.78c-.41.492-.975.827-1.602.952a9 9 0 0 1-3.153.21c-1.421-.15-3.003 0-4.434-.19a4.7 4.7 0 0 1-1.602-.52a1.83 1.83 0 0 1-.64-.842a8 8 0 0 1-.591-1.882c-.15-.83-.33-1.871-.51-3.002c-.42-2.663-.861-5.706-1.062-7.007a.36.36 0 0 0-.39-.3a.35.35 0 0 0-.29.39c.16 1.321.51 4.364.86 7.007c.14 1.13.28 2.192.411 3.003a9.3 9.3 0 0 0 .61 2.162a2.93 2.93 0 0 0 1.022 1.381a5.6 5.6 0 0 0 2.002.68c1.461.25 3.003.07 4.494.23a10 10 0 0 0 3.593-.27a4 4 0 0 0 2.183-1.41c.22-.339.392-.706.51-1.092c.16-.5.25-1 .38-1.551a71 71 0 0 0 1.112-7.538c.124-.996.175-2 .15-3.003a.8.8 0 0 0-.18-.42" />
		<path d="M9.256 16.156c.14.841.31 1.582.42 2.112c.07.34.12.591.14.711c.061.3.321.26.511.17a.23.23 0 0 0 .16-.1v-.79c0-.541 0-1.302-.11-2.153c0-.46-.09-.94-.16-1.421c0-.24-.06-.48-.11-.71c-.2-1.122-.46-2.143-.61-2.814a.302.302 0 1 0-.601.08c0 .681 0 1.742.11 2.873c0 .24 0 .47.07.711c.03.39.1.87.18 1.331m5.586 2.813a.34.34 0 0 0 .34-.34c.05-.61.22-1.542.33-2.563c.07-.56.13-1.15.15-1.711c.06-1.352 0-2.523 0-2.913a.31.31 0 0 0-.508-.247a.3.3 0 0 0-.102.207c-.06.35-.29 1.32-.46 2.502c-.05.34-.08.71-.11 1.071c-.03.36 0 .73 0 1.091c0 1.001 0 1.952.08 2.563a.34.34 0 0 0 .28.34" />
	</g>
</svg>


                            </button>
                          </div>

                          <p className="text-[10px] text-gray-400 font-bold">
                            {item.flavor && <span>{item.flavor}</span>}
                            {item.flavor && item.size && <span className="mx-1">/</span>}
                            {item.size && <span>{item.size}</span>}
                          </p>

                          <div className="flex justify-between items-end mt-2">
                            <span className="font-black text-black text-lg">
                              {(item.price * item.quantity).toLocaleString()} د.ع
                            </span>

                            {/* Quantity Controls */}
                            <div className="flex items-center bg-gray-100 rounded-xl p-1 gap-1">
                              <button
                                onClick={() => updateQuantity(item.key, -1)}
                                disabled={item.quantity <= 1}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-black font-bold disabled:opacity-30"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg>
                              </button>
                              <span className="w-8 text-center text-sm font-black text-black">{item.quantity}</span>
                              <button
                                onClick={() => updateQuantity(item.key, 1)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm transition-all text-black font-bold"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {items.length === 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="py-20 text-center flex flex-col items-center gap-4"
                    >
                      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                     
                     <Emptycart/>
                        {/* <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                        </svg> */}
                      </div>
                      <p className="text-gray-400 font-bold">سلتك فارغة حالياً</p>
                    </motion.div>
                  )}
                </div>
              </Container>
            </Drawer.Content>

            {/* Footer Actions */}
            <div className="bg-gray-50/50 border-t border-gray-100">
              <Container className="mx-auto p-6 flex flex-col gap-4">
                <div className="flex justify-between items-center px-2">
                  <span className="font-bold text-gray-500">المجموع الكلي</span>
                  <span className="text-xl font-black text-black">{total.toLocaleString()} د.ع</span>
                </div>
                <button
                  disabled={items.length === 0}
                  onClick={() => {
                    router.push("/checkout");
                    setOpen(false);
                  }}
                  className="w-full cursor-pointer bg-black text-white py-4 rounded-2xl font-black text-lg hover:bg-black/90 transition-all active:scale-[0.98] shadow-lg shadow-black/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  إتمام الطلب
                </button>
              </Container>
            </div>

            {/* Handle */}
            <div className={styles.DragArea}>
              <div className={styles.Handle} />
            </div>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
