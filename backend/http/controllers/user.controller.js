import { dashboard } from "../services/user.service.js";

export async function getDashboard(req, res) {
    try {
        const data = await dashboard(req.user.id);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({
            message: "Error fetching dashboard"
        });
    }
}