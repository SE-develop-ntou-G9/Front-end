import { motion, AnimatePresence } from "framer-motion";

function PassengerPopover({ passenger, onClose }) {
    if (!passenger) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.18 }}
                className="absolute z-50 top-8 left-0 w-64 bg-white rounded-xl shadow-xl border p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3">
                    <img
                        src={
                            passenger.avatar ||
                            "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        }
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold text-gray-800">
                            {passenger.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            乘客
                        </p>
                    </div>
                </div>

                {/* 之後再  擴充 */}
                <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex gap-2">
                        <span className="text-gray-500">📧</span>
                        <span className="break-all">
                            {passenger.Email || "未提供 Email"}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <span className="text-gray-500">📞</span>
                        <span>
                            {passenger.PhoneNumber || "未提供電話"}
                        </span>
                    </div>
                </div>

                <button
                    onClick={onClose}
                    className="mt-3 w-full text-xs text-gray-500 hover:text-gray-700"
                >
                    關閉
                </button>
            </motion.div>
        </AnimatePresence>
    );
}

export default PassengerPopover;
