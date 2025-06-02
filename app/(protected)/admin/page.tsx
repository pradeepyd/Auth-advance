"use client";

import { Card, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";

const AdminPage = () => {
    const role = useCurrentRole();
    return (
        <Card>
            <CardHeader>
                <p>
                    
                </p>
            </CardHeader>
        </Card>
    );
};

export default AdminPage;