declare module "@dabeng/react-orgchart" {
    import React from 'react';

    interface OrgChartProps {
        ref?: React.Ref<any>;
        datasource: any;
        pan?: boolean;
        zoom?: boolean;
        collapsible?: boolean;
        onZoomChange?: (scale: number) => void;
        NodeTemplate?: React.ComponentType<{ nodeData: any }>;
        style?: React.CSSProperties;
    }

    interface OrgChartInstance {
        chart: {
            setChartScale(scale: number): void;
        };
    }

    const OrgChart: React.ForwardRefExoticComponent<
        OrgChartProps & React.RefAttributes<OrgChartInstance>
    >;

    export default OrgChart;
}
