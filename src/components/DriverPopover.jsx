import { motion, AnimatePresence } from "framer-motion";

function DriverPopover({ driver, onClose }) {
    if (!driver) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute z-50 top-8 left-0 w-64 bg-white rounded-xl shadow-xl border p-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center gap-3">
                    <img
                        src={driver.AvatarURL || "https://placehold.co/80x80"}
                        className="w-12 h-12 rounded-full object-cover"
                        alt="driver"
                    />
                    <div>
                        <p className="font-semibold text-gray-800">
                            {driver.Name || "司機"}
                        </p>
                        <p className="text-xs text-gray-500">
                            🏍️ 車主 / 駕駛
                        </p>
                    </div>
                </div>

                <div className="mt-3 space-y-1 text-sm text-gray-700">
                    <p>📧 {driver.Email || "未提供 Email"}</p>
                    <p>📞 {driver.PhoneNumber || "未提供電話"}</p>
                    <p>🏍️ 車型：{driver.vehicle_info || "未提供"}</p>
                    <p>🔢 車牌：{driver.plate_num || "未提供"}</p>
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

export default DriverPopover;
