
import { getNodeColor, Base_Info } from './legendColor.js';

const svgNameSpace = 'http://www.w3.org/2000/svg';

const Start = {
    _nodes: [],
    _links: [],
    _centerPoint: null,
    _groupList: [],
    _svgEle: null,

    init: function (svgEle, allData) {
        const { nodes, links, centerPoint, groupList } = allData;
        links.forEach(link => {
            const source = nodes.find(node => node.id === link.id1);
            const target = nodes.find(node => node.id === link.id2);
            link.source = source;
            link.target = target;
        })

        this._nodes = nodes;
        this._links = links;
        this._centerPoint = centerPoint;
        this._groupList = groupList;
        this._svgEle = svgEle;
    },
    draw: function () {
        // const body_Width = svgEle.clientWidth;
        // const body_Height = svgEle.clientHeight;
        const svgCon = document.createElementNS(svgNameSpace, 'g');
        svgCon.setAttribute('class', "start-con");
        this._svgEle.appendChild(svgCon);

        const svg_base_zoom = this._draw_Zoom_Init()
        svgCon.appendChild(svg_base_zoom);
        const panZoomTiger = svgPanZoom(this._svgEle, { onZoom: this._onZoomFnc });//设置缩放


        const svg_links = document.createElementNS(svgNameSpace, 'g');
        svg_links.setAttribute('class', "start-links");
        svgCon.appendChild(svg_links);

        const svg_nodes = document.createElementNS(svgNameSpace, 'g');
        svg_nodes.setAttribute('class', "start-nodes");
        svgCon.appendChild(svg_nodes);

        this._drawLinks(svg_links, this._links);//划线
        this._drawStarts(svg_nodes, this._nodes);//划点

        const svg_group_g = document.createElementNS(svgNameSpace, 'g');
        svg_group_g.setAttribute('class', "start-group-info");//族群信息
        svgCon.appendChild(svg_group_g);

        const svg_filter_g = document.createElementNS(svgNameSpace, 'g');
        drawFilter(svg_filter_g);//遮罩层
        svgCon.appendChild(svg_filter_g);

        const svg_lighterNode = document.createElementNS(svgNameSpace, 'g');
        svg_lighterNode.setAttribute('class', "start-lighterNode");
        svgCon.appendChild(svg_lighterNode);//高亮点线
    },
    //初始框，控制初缩放
    _draw_Zoom_Init: function () {
        const svg_base_zoom_g = document.createElementNS(svgNameSpace, 'g');
        const svg_filter = document.createElementNS(svgNameSpace, 'rect');
        svg_filter.setAttribute('x', -250);
        svg_filter.setAttribute('y', -200);
        svg_filter.setAttribute('width', 500);
        svg_filter.setAttribute('height', 400);
        svg_filter.setAttribute('style', "fill:rgb(255,255,255);fill-opacity:0;pointer-events: none;");
        svg_base_zoom_g.appendChild(svg_filter);
        return svg_base_zoom_g;
    },

    //缩放后调整大小
    _onZoomFnc: function (zoom) {
        console.log(zoom);
        const allNodes = document.querySelectorAll('.start-nodes .start-node');
        allNodes.forEach(node => {
            const self_data = JSON.parse(node.getAttribute('self-data'));
            const svg_start = node.querySelector('circle');
            const svg_text = node.querySelector('text');
            if (svg_start) {
                const r_zoom = zoom > 1 ? self_data.lnumSqrt / zoom : self_data.lnumSqrt;
                svg_start.setAttribute('r', r_zoom);
            }
            if (svg_text) {
                const fontSize_zoom = zoom > 1 ? (Base_Info.fontSize / zoom) : Base_Info.fontSize;
                const dx_zoom = zoom > 1 ? self_data.lnumSqrt / zoom : self_data.lnumSqrt;
                svg_text.setAttribute('font-size', fontSize_zoom);
                svg_start.setAttribute('dx', dx_zoom);
            }
        })

        const allLinks = document.querySelectorAll('.start-links .start-link');

        allLinks.forEach(svg_link => {
            const self_data = JSON.parse(svg_link.getAttribute('self-data'));
            const svg_line = svg_link.querySelector('line');
            const width_zoom = zoom > 1 ? self_data.cnumSqrt / zoom : self_data.cnumSqrt;
            svg_line.setAttribute('stroke-width', width_zoom);
        })

    },

    //绘制连线
    _drawLinks: function (svg_links, links) {
        links.forEach(singleLink => {
            const svg_g = document.createElementNS(svgNameSpace, 'g');
            svg_g.setAttribute('class', "start-link");
            svg_g.setAttribute('self-data', JSON.stringify(singleLink));

            //连线
            const svg_line = document.createElementNS(svgNameSpace, 'line');

            svg_line.setAttribute('class', "start-link-line");
            svg_line.setAttribute('x1', singleLink.source.row);
            svg_line.setAttribute('y1', singleLink.source.col);
            svg_line.setAttribute('x2', singleLink.target.row);
            svg_line.setAttribute('y2', singleLink.target.col);
            svg_line.setAttribute('stroke-width', singleLink.cnumSqrt);

            svg_g.appendChild(svg_line);
            svg_links.appendChild(svg_g);
        })
    },

    _drawStarts: function (svg_nodes, starts) {
        starts.forEach(singleStart => {
            const svg_g = document.createElementNS(svgNameSpace, 'g');
            svg_g.setAttribute('class', "start-node");
            svg_g.setAttribute('self-data', JSON.stringify(singleStart));
            svg_g.setAttribute('transform', `translate(${singleStart.row},${singleStart.col})`);
            //点
            const svg_circle = document.createElementNS(svgNameSpace, 'circle');
            svg_circle.setAttribute('class', "start-node-circle");
            const nodeStyle = `fill:${getNodeColor(singleStart, 'series')}`;
            svg_circle.style = nodeStyle;
            svg_circle.setAttribute('r', singleStart.lnumSqrt);
            //车系名称
            const svg_text = document.createElementNS(svgNameSpace, 'text');
            svg_text.setAttribute('class', "start-node-text");
            svg_text.style = `stroke-width:${1};fill:#333;pointer-events: none; fill-opacity: 1;`;
            svg_text.setAttribute('dx', singleStart.lnumSqrt); //使用setAttribute来设置rect节点属性
            svg_text.textContent = singleStart.sname;
            svg_text.setAttribute('font-size', Base_Info.fontSize);

            //绑定鼠标悬浮事件
            bindStartMouse(svg_circle);
            svg_g.appendChild(svg_circle);
            svg_g.appendChild(svg_text);
            svg_nodes.appendChild(svg_g);
        })
    },

    //遮罩层，鼠标悬浮时遮罩其他
    _drawFilter: function (svg_filter_g) {

        const svg_filter = document.createElementNS(svgNameSpace, 'rect');
        svg_filter.setAttribute('class', "start-filter");
        svg_filter.setAttribute('x', -10000);
        svg_filter.setAttribute('y', -10000);
        svg_filter.setAttribute('width', 20000);
        svg_filter.setAttribute('height', 20000);
        svg_filter.setAttribute('style', "fill:rgb(255,255,255);fill-opacity:0;pointer-events: none;");
        svg_filter_g.appendChild(svg_filter);

    },

    //绑定点悬浮事件
    _bindStartMouse: function (svg_start) {

        svg_start.addEventListener("mouseover", function () {
            const start_lighterNode = document.querySelector('.start-lighterNode');

            const svg_filter = document.querySelector('.start-filter');
            svg_filter.setAttribute('style', "fill:rgb(255,255,255);fill-opacity:0.8;pointer-events: none;");
            //查找相关的点线
            const self_data = JSON.parse(this.parentNode.getAttribute('self-data'));
            const allLinks = document.querySelectorAll('.start-links .start-link');
            const allNodes = document.querySelectorAll('.start-nodes .start-node');
            const start_linkS_id = [];
            allLinks.forEach(svg_link => {
                const link_self_data = JSON.parse(svg_link.getAttribute('self-data'));
                if (link_self_data.id1 == self_data.id) {
                    start_lighterNode.appendChild(svg_link.cloneNode(true));
                    start_linkS_id.push(link_self_data.id2);
                }
            });
            allNodes.forEach(svg_node => {
                const node_self_data = JSON.parse(svg_node.getAttribute('self-data'));
                if (start_linkS_id.indexOf(node_self_data.id) >= 0) {
                    start_lighterNode.appendChild(svg_node.cloneNode(true));
                }
            });
            start_lighterNode.appendChild(this.parentNode.cloneNode(true));
        });
        svg_start.addEventListener("mouseout", function () {
            const svg_filter = document.querySelector('.start-filter');
            svg_filter.setAttribute('style', "fill:rgb(255,255,255);fill-opacity:0;pointer-events: none;");

            const start_lighterNode = document.querySelector('.start-lighterNode');

            for (var j = 0; j < start_lighterNode.childElementCount;) {
                start_lighterNode.removeChild(start_lighterNode.firstChild);
            }
        });
    },


    //显示族群
    showGroupInfo: function (groupList) {
        const start_Group_g = document.querySelector('.start-group-info');
    },

    //隐藏族群
    hideGroupInfo: function () {

    }
}
export {
    Start
}