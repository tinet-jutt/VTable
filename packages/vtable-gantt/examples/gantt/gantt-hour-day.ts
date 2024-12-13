import type { ColumnsDefine } from '@visactor/vtable';
import type { GanttConstructorOptions, TYPES } from '../../src/index';
import { VTable } from '../../src/index';
import * as VTableGantt from '../../src/index';
import { Gantt, tools } from '../../src/index';
import { DependencyType } from '../../src/ts-types';
import { bindDebugTool } from '../../../vtable/src/scenegraph/debug-tool';
const CONTAINER_ID = 'vTable';

const flag = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#e16531" xmlns="http://www.w3.org/2000/svg">
<path d="M5 15h15.415a1.5 1.5 0 0 0 1.303-2.244l-2.434-4.26a1 1 0 0 1 0-.992l2.434-4.26A1.5 1.5 0 0 0 20.415 1H5a2 
2 0 0 0-2 2v19a1 1 0 0 0 2 .003V15Z" fill="#e16531"/>
</svg>
`;
const report = `<svg width="24" height="24" viewBox="0 0 24 24" fill="#FFD43C" xmlns="http://www.w3.org/2000/svg">
<path d="M13.732 2c-.77-1.333-2.694-1.333-3.464 0L.742 19c-.77 1.334.192 3 1.732 3h19.052c1.54 0 2.502-1.666 
1.733-3L13.732 2ZM10.75 8.25a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 .75.75v6a.75.75 0 0 1-.75.75h-1a.75.75 0 0 
1-.75-.75v-6Zm0 8.5a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 .75.75v1a.75.75 0 0 1-.75.75h-1a.75.75 0 0 1-.75-.75v-1Z" 
fill="#FFD43C"/>
</svg>
`;
const flagIcon = {
  type: 'svg',
  svg: flag,
  width: 20,
  height: 20,
  name: 'flag',
  positionType: VTable.TYPES.IconPosition.left,
  cursor: 'pointer'
};
const reportIcon = {
  type: 'svg',
  svg: report,
  width: 20,
  height: 20,
  name: 'report',
  positionType: VTable.TYPES.IconPosition.left,
  cursor: 'pointer'
};
VTable.register.icon('flag', flagIcon);
VTable.register.icon('report', reportIcon);
const popup = document.createElement('div');
Object.assign(popup.style, {
  position: 'fixed',
  width: '300px',
  backgroundColor: '#f1f1f1',
  border: '1px solid #ccc',
  padding: '20px',
  textAlign: 'left'
});
function showTooltip(infoList, x, y) {
  popup.innerHTML = '';
  popup.id = 'popup';
  popup.style.left = x + 'px';
  popup.style.top = y + 'px';
  const heading = document.createElement('h4');
  heading.textContent = '任务信息';
  heading.style.margin = '0px';
  popup.appendChild(heading);
  const keys = {
    name: '名称',
    planFinishCalendar: '计划开始',
    planStartCalendar: '计划结束'
  };
  for (const key in infoList) {
    if (!keys[key]) {
      continue;
    }
    const info = infoList[key];
    const info1 = document.createElement('p');
    info1.textContent = keys[key] + ': ' + info;
    popup.appendChild(info1);
  }

  // 将弹出框添加到文档主体中
  document.body.appendChild(popup);
}

function hideTooltip() {
  if (document.body.contains(popup)) {
    document.body.removeChild(popup);
  }
}
export function createTable() {
  const customLayout = args => {
    const { width, height, taskRecord } = args;
    const container = new VTableGantt.VRender.Group({
      width,
      height,
      cornerRadius: 10,
      fill: taskRecord?.timeConflict
        ? '#f0943a'
        : taskRecord?.keyNode
        ? '#446eeb'
        : taskRecord?.confirmed
        ? '#63bb5c'
        : '#ebeced',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'nowrap',
      alignItems: 'center',
      boundsPadding: 10
    });

    if (taskRecord?.timeConflict) {
      const reportIcon = new VTableGantt.VRender.Image({
        width: 20,
        height: 20,
        image: report
      });
      container.add(reportIcon);
    }

    if (taskRecord?.keyNode) {
      const reportIcon = new VTableGantt.VRender.Image({
        width: 20,
        height: 20,
        image: flag
      });
      container.add(reportIcon);
    }

    const name = new VTableGantt.VRender.Text({
      text: taskRecord.name,
      fill: taskRecord?.keyNode ? '#fff' : '#0f2819',
      suffixPosition: 'end',
      fontSize: 14,
      boundsPadding: 10
    });

    container.add(name);

    container.addEventListener('mouseenter', event => {
      const container = document.getElementById(CONTAINER_ID);
      const containerRect = container!.getBoundingClientRect();
      const targetY = event.target.globalAABBBounds.y2;
      const targetX = event.target.globalAABBBounds.x1;
      showTooltip(taskRecord, event.client.x, targetY);
    });

    container.addEventListener('mouseleave', () => {
      hideTooltip();
    });

    return {
      rootContainer: container
    };
  };

  const records = [
    {
      key: '0',
      check: {
        checked: false,
        disable: true
      },
      name: 'FA账期关闭',
      planStartCalendar: '2025-01-01 10:00:00',
      planFinishCalendar: '2025-01-03 00:00:00',
      hierarchyState: 'expand',
      keyNode: false,
      timeConflict: false,
      confirmed: false,
      children: [
        {
          key: '0,0',
          check: {
            checked: false,
            disable: true
          },
          name: 'FA账期关闭',
          planStartCalendar: '2025-01-02 13:30',
          planFinishCalendar: '2025-01-02 15:00',
          hierarchyState: 'expand',
          keyNode: true,
          timeConflict: false,
          confirmed: false,
          children: [
            {
              key: '0,0,0',
              check: {
                checked: false,
                disable: true
              },
              name: '负责人',
              planStartCalendar: '2025-01-02 13:30',
              planFinishCalendar: '2025-01-02 15:00',
              keyNode: false,
              timeConflict: true,
              confirmed: false
            }
          ]
        }
      ]
    },
    {
      key: '1',
      check: {
        checked: false,
        disable: true
      },
      name: 'GL资金结账',
      planStartCalendar: '2025-01-01 10:00:00',
      planFinishCalendar: '2025-01-05 00:00:00',
      hierarchyState: 'expand',
      keyNode: false,
      timeConflict: false,
      confirmed: false,
      children: [
        {
          key: '1,0',
          check: {
            checked: false,
            disable: true
          },
          name: '第三方提现中转核对',
          planStartCalendar: '2025-01-02 10:30',
          planFinishCalendar: '2025-01-03 12:00',
          hierarchyState: 'expand',
          keyNode: false,
          timeConflict: false,
          confirmed: false,
          children: [
            {
              key: '1,0,0',
              check: {
                checked: false,
                disable: true
              },
              name: '负责人',
              planStartCalendar: '2025-01-02 10:30',
              planFinishCalendar: '2025-01-03 12:00',
              keyNode: false,
              timeConflict: false,
              confirmed: false
            }
          ]
        },
        {
          key: '1,1',
          check: {
            checked: false,
            disable: true
          },
          name: '红包提现流水入账',
          planStartCalendar: '2025-01-03 10:30',
          planFinishCalendar: '2025-01-03 12:00',
          hierarchyState: 'expand',
          keyNode: false,
          timeConflict: false,
          confirmed: false,
          children: [
            {
              key: '1,1,0',
              check: {
                checked: false,
                disable: true
              },
              name: '负责人',
              planStartCalendar: '2025-01-03 10:30',
              planFinishCalendar: '2025-01-03 12:00',
              keyNode: false,
              timeConflict: false,
              confirmed: false
            }
          ]
        },
        {
          key: '1,2',
          check: {
            checked: false,
            disable: true
          },
          name: '资金中转对平',
          planStartCalendar: '2025-01-03 16:00',
          planFinishCalendar: '2025-01-03 19:00',
          hierarchyState: 'expand',
          keyNode: false,
          timeConflict: false,
          confirmed: false,
          children: [
            {
              key: '1,2,0',
              check: {
                checked: false,
                disable: true
              },
              name: '负责人',
              planStartCalendar: '2025-01-03 16:00',
              planFinishCalendar: '2025-01-03 19:00',
              keyNode: false,
              timeConflict: false,
              confirmed: false
            }
          ]
        },
        {
          key: '1,3',
          check: {
            checked: false,
            disable: true
          },
          name: '投资组完成境内流水认款',
          planStartCalendar: '2025-01-03 10:00',
          planFinishCalendar: '2025-01-03 19:00',
          hierarchyState: 'expand',
          keyNode: false,
          timeConflict: false,
          confirmed: false,
          children: [
            {
              key: '1,3,0',
              check: {
                checked: false,
                disable: true
              },
              name: '负责人',
              planStartCalendar: '2025-01-03 10:00',
              planFinishCalendar: '2025-01-03 19:00',
              keyNode: false,
              timeConflict: false,
              confirmed: false
            }
          ]
        }
      ]
    }
  ];
  const columns = [
    {
      headerType: 'checkbox', //指定表头单元格显示为复选框
      cellType: 'checkbox', //指定body单元格显示为复选框
      field: 'check',
      checked: true,
      width: 50
    },
    {
      field: 'name',
      title: '任务',
      width: 220,
      tree: true,
      icon: ({ table, col, row }) => {
        const record = table.getCellOriginRecord(col, row);
        if (record.keyNode) {
          return 'flag';
        }
      },
      style: ({ table, col, row }) => {
        const record = table.getCellOriginRecord(col, row);
        return {
          // - 已确认-绿底；未确认-白底
          bgColor: record?.timeConflict ? '#f0943a' : record.confirmed ? '#63bb5c' : undefined
        };
      }
    },
    {
      field: 'planStartCalendar',
      title: '计划开始',
      width: 'auto'
    },
    {
      field: 'planFinishCalendar',
      title: '计划完成',
      width: 'auto'
    }
  ];
  const option: GanttConstructorOptions = {
    overscrollBehavior: 'none',
    records,
    taskListTable: {
      enableTreeNodeMerge: true,
      columns,
      tableWidth: 'auto',
      theme: VTable.themes.ARCO.extends({
        // 表格外边框设置
        frameStyle: {
          borderLineWidth: 0,
          shadowBlur: 0
        },
        headerStyle: {
          hover: {
            cellBgColor: '#eef1f5'
          }
        },
        bodyStyle: {
          bgColor: '#fff',
          hover: {
            cellBgColor: 'rgba(0,0,0,0.03)'
          }
        },
        tooltipStyle: { color: '#fff', bgColor: '#202328' }
      }),
      tooltip: {
        isShowOverflowTextTooltip: true
      },
      menu: {
        contextMenuItems: ['编辑']
      },
      frozenColCount: 1
    },
    frame: {
      outerFrameStyle: {
        borderLineWidth: 1,
        borderColor: '#e1e4e8',
        cornerRadius: 0
      },
      verticalSplitLine: {
        lineColor: '#e1e4e8',
        lineWidth: 1
      },
      horizontalSplitLine: {
        lineColor: '#e1e4e8',
        lineWidth: 1
      },
      verticalSplitLineMoveable: true,
      verticalSplitLineHighlight: {
        lineColor: 'green',
        lineWidth: 1
      }
    },
    grid: {
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      }
    },
    headerRowHeight: 40,
    rowHeight: 40,
    taskBar: {
      startDateField: 'planStartCalendar',
      endDateField: 'planFinishCalendar',
      progressField: 'progress',
      resizable: true,
      moveable: true,
      scheduleCreatable: false,
      labelTextStyle: {
        fontFamily: 'Arial',
        fontSize: 14,
        textAlign: 'right',
        textOverflow: 'ellipsis',
        textBaseline: 'bottom'
      },
      barStyle: {
        width: 30,
        /** 任务条的圆角 */
        cornerRadius: 10,
        /** 任务条的边框 */
        borderWidth: 0,
        /** 边框颜色 */
        borderColor: 'black'
      },
      hoverBarStyle: {
        /** 任务条的颜色 */
        barOverlayColor: 'rgba(0,0,0,0.15)'
      },
      selectedBarStyle: {
        /** 任务条的颜色 */
        borderColor: '#000000',
        borderLineWidth: 0
      },
      customLayout
    },
    timelineHeader: {
      verticalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      horizontalLine: {
        lineWidth: 1,
        lineColor: '#e1e4e8'
      },
      backgroundColor: '#EEF1F5',
      colWidth: 40,
      scales: [
        {
          unit: 'day',
          step: 1,
          startOfWeek: 'sunday',
          format(date: TYPES.DateFormatArgumentType): string {
            const day = tools.formatDate(new Date(date.startDate), 'yyyy-mm-dd');
            return day;
          },
          style: {
            fontSize: 16,
            fontWeight: 'normal'
          }
        },
        {
          unit: 'hour',
          step: 1,
          style: {
            fontSize: 14,
            fontWeight: 'normal'
          }
        }
      ]
    },
    markLine: [
      {
        date: '2025-01-02 13:30:00',
        scrollToMarkLine: true,
        position: 'middle',
        style: {
          lineColor: 'red',
          lineWidth: 1,
          lineDash: [5, 5]
        }
      }
    ],
    scrollStyle: {
      scrollRailColor: 'RGBA(246,246,246,0.5)',
      visible: 'scrolling',
      width: 6,
      scrollSliderCornerRadius: 2,
      scrollSliderColor: '#c0c0c0'
    }
  };
  // columns:[
  //   {
  //     title:'2024-07',
  //     columns:[
  //       {
  //         title:'01'
  //       },
  //       {
  //         title:'02'
  //       },
  //       ...
  //     ]
  //   },
  //   ...
  // ]
  const ganttInstance = new Gantt(document.getElementById(CONTAINER_ID)!, option);
  window.ganttInstance = ganttInstance;
  ganttInstance.on('scroll', e => {
    console.log('scroll', e);
  });
  ganttInstance.on('change_date_range', e => {
    console.log('change_date_range', e);
  });
  ganttInstance.on('mouseenter_task_bar', e => {
    console.log('mouseenter_taskbar', e);
  });
  ganttInstance.on('mouseleave_task_bar', e => {
    console.log('mouseleave_taskbar', e);
  });
  ganttInstance.on('click_task_bar', e => {
    console.log('click_task_bar', e);
  });
  ganttInstance.taskListTableInstance?.on('scroll', e => {
    console.log('listTable scroll', e);
  });
  ganttInstance.taskListTableInstance?.on('change_header_position_start', e => {
    console.log('change_header_position_start ', e);
  });
  ganttInstance.taskListTableInstance?.on('changing_header_position', e => {
    console.log('changing_header_position ', e);
  });
  bindDebugTool(ganttInstance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });
}
